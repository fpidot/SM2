/* eslint-disable no-console */
import EditListingForm from './EditListingForm';

export const Empty = {
  component: EditListingForm,
  props: {
    stripeConnected: false,
    onImageUpload: values => {
      console.log(`onImageUpload with id (${values.id}) and file name (${values.file.name})`);
    },
    onSubmit: values => {
      console.log('Submit EditListingForm with (unformatted) values:', values);
    },
    onUpdateImageOrder: imageOrder => {
      console.log('onUpdateImageOrder with new imageOrder:', imageOrder);
    },
  },
};
