import React from 'react';
import { Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import reduxForm from 'redux-form/es/reduxForm';
import { Field } from 'redux-form';
import { RfRate, RfTextArea, CheckTagGroup } from 'components/RfInput';

// import CheckboxGroup from 'antd/lib/checkbox/Group';

let optionsList = [
  { id: 1, name: 'Good Commuicator', analysis: true },
  { id: 2, name: 'Poor Communicator', analysis: false },
  { id: 3, name: 'Lack of Confidence', analysis: false },
  { id: 4, name: 'Unnecessarily Confident', analysis: false },
  { id: 5, name: 'Lack of Interaction', analysis: false },
];

const validate = values => {
  const errors = {};
  if (!values.rateTech) errors.rateTech = 'Techical Rate Required';
  if (!values.rateDetail) errors.rateDetail = 'Detail Rate Required';
  if (!values.rateComplete) errors.rateComplete = 'Completenes Rate Required';
  return errors;
};

class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.submitForm = this.props.handleSubmit(async data => {
      await this.props.onSubmit({ input: data });
      this.props.reset(); // reset form after submitting
    });
  }
  componentWillMount() {
    this.props.initialize({ tags: ['Lack of Confidence'] });
  }
  render() {
    const { visible } = this.props;
    return (
      <>
        <Modal
          visible={visible}
          footer={false}
          closable={false}
          maskClosable={false}
        >
          <form onSubmit={this.submitForm}>
            <h1>Rate the Problem</h1>
            <Field name="rateTech" component={RfRate} label="Technical Skill" />
            <Field
              name="rateDetail"
              component={RfRate}
              label="Detail Oriented"
            />
            <Field
              name="rateComplete"
              component={RfRate}
              label="Completeness"
            />
            <Field name="summary" component={RfTextArea} />
            <h1>Overall Review</h1>
            <div>
              <Field
                name="tags"
                type="checkbox"
                component={CheckTagGroup}
                options={optionsList}
                defaultValue={['Lack of Confidence']}
              />
            </div>

            <Button htmlType="submit"> Add Review </Button>
          </form>
        </Modal>
      </>
    );
  }
}
CommentBox.propTypes = {
  visible: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setVisible: PropTypes.func.isRequired,
};

export default reduxForm({
  // pass from parent for embed same form multiple times
  // https://stackoverflow.com/questions/37456526/how-to-embed-the-same-redux-form-multiple-times-on-a-page/37464048#37464048
  form: 'InterviewerComment',
  validate,
})(CommentBox);
