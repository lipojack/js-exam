import React from 'react';
import { Connect } from 'aws-amplify-react';
import { graphqlOperation } from 'aws-amplify';

import PageEmpty from 'components/PageEmpty';
import PageSpin from 'components/PageSpin';

import ResultBin from './ResultBin';

const listTestsDateQl = `query ListTests(
  $filter: ModelTestFilterInput
  $limit: Int
  $nextToken: String
) {
  listTests(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      timeBegin
    }
    nextToken
  }
}`;

const CandidateListPage = () => (
  <Connect query={graphqlOperation(listTestsDateQl, { limit: 2000 })}>
    {({ data: { listTests: tests }, loading, error }) => {
      let testsDate = [];
      if (tests) {
        testsDate = tests.items
          .map(test => test.timeBegin && test.timeBegin.slice(0, 10))
          .filter((ele, index, self) => ele && self.indexOf(ele) === index);
      }
      return (
        <PageSpin spinning={loading}>
          {!loading && error && (
            <PageEmpty description={<span>Error Occuring</span>} />
          )}
          {!loading && !tests && (
            <PageEmpty
              description={<span>Data Not Found</span>}
              image="default"
            />
          )}
          {!loading && <ResultBin testsDate={testsDate} isLoading={loading} />}
        </PageSpin>
      );
    }}
  </Connect>
);

export default CandidateListPage;
