// CheckInDialog.js
import React from 'react';
import { Dialog, Portal, PaperButton, PaperText } from 'react-native-paper';

const CheckInDialog = ({ visible, hideDialog, dialogType }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>
          {dialogType === 'checkin' ? 'Check-In Successful' : 'Check-Out Successful'}
        </Dialog.Title>
        <Dialog.Content>
          <PaperText variant="bodyMedium">
            {dialogType === 'checkin' ? 'You have successfully checked in!' : 'You have successfully checked out!'}
          </PaperText>
        </Dialog.Content>
        <Dialog.Actions>
          <PaperButton onPress={hideDialog}>Done</PaperButton>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CheckInDialog;
