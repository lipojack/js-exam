import React from 'react';
import { Connect } from 'aws-amplify-react';
import { graphqlOperation } from 'aws-amplify';
import moment from 'moment';

import { listTests } from 'graphql/queries';
import { onCreateTest, onDeleteTest } from 'graphql/subscriptions';
import PropTypes from 'prop-types';

import PageEmpty from 'components/PageEmpty';
import PageSpin from 'components/PageSpin';

import { Collapse } from 'antd';

import TestList from '../TestList';

const Panel = Collapse.Panel;

const byTime = ascending => (a, b) => {
  let result;

  if (a === null || b === null) {
    if (a === null) result = 1;
    else if (b === null) result = -1;
  } else {
    const A = new Date(a.timeBegin || a).getTime();
    const B = new Date(b.timeBegin || b).getTime();
    result = A - B;
  }

  return ascending ? result : result * -1;
};

const isValid = variable => {
  if (variable === undefined || variable === null) return false;
  return true;
};

function scrollToPanel(key) {
  if (!key) return;
  document.getElementById(key).scrollIntoView({});
}

const ResultBin = ({ testsDate }) => {
  let sortedTests;

  testsDate.sort(byTime(false));

  return testsDate ? (
    <Collapse accordion onChange={scrollToPanel}>
      {testsDate.map((testDate, i) => {
        if (testDate) {
          const dayBeginUTC = moment(testDate).toISOString();
          const dayEndUTC = moment(testDate)
            .add(1, 'days')
            .toISOString();
          return (
            <Panel
              header={moment(testDate).format('MMM. DD, YYYY')}
              key={testDate}
              id={testDate}
            >
              {
                <Connect
                  query={graphqlOperation(listTests, {
                    limit: 2000,
                    filter: {
                      timeBegin: {
                        between: [dayBeginUTC, dayEndUTC],
                      },
                    },
                  })}
                  subscription={graphqlOperation(onCreateTest)}
                  onSubscriptionMsg={(prev, { onCreateTest: createdTest }) => {
                    if (
                      testDate === moment().format('YYYY-MM-DD') &&
                      prev.listTests.items[0].id !== createdTest.id
                    ) {
                      prev.listTests.items.unshift(createdTest);
                    }
                    return prev;
                  }}
                >
                  {({ data: { listTests: tests }, loading, error }) => (
                    <Connect
                      subscription={graphqlOperation(onDeleteTest)}
                      onSubscriptionMsg={(
                        prev,
                        { onDeleteTest: deletedTest },
                      ) => deletedTest}
                    >
                      {({ data: deletedTest, loading2, error2 }) => {
                        if (deletedTest.id) {
                          const delTestIndex = tests.items.findIndex(
                            test => test && test.id === deletedTest.id,
                          );
                          if (delTestIndex !== -1) {
                            tests.items.splice(delTestIndex, 1);
                          }
                        }
                        sortedTests =
                          tests &&
                          tests.items
                            .filter(test => isValid(test))
                            .sort(byTime(false));
                        return (
                          <PageSpin spinning={loading}>
                            {!loading && (error || error2) && (
                              <PageEmpty
                                description={<span>Error Occuring</span>}
                              />
                            )}

                            {!loading && !tests && (
                              <PageEmpty
                                description={<span>Data Not Found</span>}
                                image="default"
                              />
                            )}
                            {!loading && sortedTests && (
                              <TestList data={sortedTests} />
                            )}
                          </PageSpin>
                        );
                      }}
                    </Connect>
                  )}
                </Connect>
              }
            </Panel>
          );
        }
        return null;
      })}
    </Collapse>
  ) : null;
};

ResultBin.propTypes = {
  testsDate: PropTypes.array,
};

export default ResultBin;
