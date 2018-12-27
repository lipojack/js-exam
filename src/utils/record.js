import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsExportConfig from 'aws-exports';
import * as mutations from 'graphql/mutations';
import * as subscriptions from 'graphql/subscriptions';

Amplify.configure(awsExportConfig);

const createRecord = async ({ subjectId, roomId, question }) => {
  const params = {
    input: {
      subjectId,
      syncCode: question.content,
      timeBegin: parseInt(new Date().getTime() / 1000, 10), // must to be Int
      ques: question,
      recordRoomId: roomId,
    },
  };
  const { data } = await API.graphql(
    graphqlOperation(mutations.createRecord, params),
  );
  return data.createRecord;
};
const updateRecord = async (id, newCode, subjectId) => {
  const params = {
    input: {
      id,
      subjectId,
      syncCode: newCode,
      timeEnd: parseInt(new Date().getTime() / 1000, 10), // must to be Int
    },
  };
  const result = await API.graphql(
    graphqlOperation(mutations.updateRecord, params),
  );
  return result;
};

const subscribeOnCreateRecord = callback => {
  return API.graphql(graphqlOperation(subscriptions.onCreateRecord)).subscribe({
    next: ({ value }) => {
      callback(value.data.onCreateRecord);
    },
    error: error => {
      console.error(error);
    },
  });
};

const subscribeOnUpdateRecord = callback => {
  API.graphql(graphqlOperation(subscriptions.onUpdateRecord)).subscribe({
    next: ({ value }) => {
      callback(value.data.onUpdateRecord);
    },
    error: error => {
      console.error(error);
    },
  });
};

const subscribeOnUpdateRecordByRecordId = (id, callback) => {
  return API.graphql(
    graphqlOperation(subscriptions.onUpdateRecordByRecordId, { id }),
  ).subscribe({
    next: ({ value }) => {
      callback(value.data.onUpdateRecordByRecordId);
    },
    error: error => {
      console.error(error);
    },
  });
};

const listRecords = async subjectId => {
  const query = `query {listRecords(filter:{subjectId:{eq:"${subjectId}"}}limit: 1000){
    items {
      id
      subjectId
      syncCode
      timeBegin
      timeEnd
    }
    nextToken
  }
  }
 `;
  const { data } = await API.graphql(graphqlOperation(query));
  return data.listRecords.items;
};

export {
  listRecords,
  createRecord,
  updateRecord,
  subscribeOnCreateRecord,
  subscribeOnUpdateRecord,
  subscribeOnUpdateRecordByRecordId,
};