import React, { Component } from 'react';
import { Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as MailComposer from 'expo-mail-composer';

import * as Animatable from 'react-native-animatable';

class Contact extends Component {
  render() {
    return (
      <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
        <Card>
          <Card.Title>Contact Information</Card.Title>
          <Card.Divider />
          <Text style={{ margin: 10 }}>121, Clear Water Bay Road</Text>
          <Text style={{ margin: 10 }}>Clear Water Bay, Kowloon</Text>
          <Text style={{ margin: 10 }}>HONG KONG</Text>
          <Text style={{ margin: 10 }}>Tel: +852 1234 5678</Text>
          <Text style={{ margin: 10 }}>Fax: +852 8765 4321</Text>
          <Text style={{ margin: 10 }}>Email: phuc.nh12490@sinhvien.hoasen.edu.vn</Text>
          <Button title=' Compose Email' buttonStyle={{ backgroundColor: '#7cc' }}
            icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
            onPress={this.composeMail} />
        </Card>
      </Animatable.View>
    );
  }
  composeMail() {
    MailComposer.composeAsync({
      recipients: ['nguyenhoangphuc2002vn@gmail.com'],
      subject: 'From PhucNH',
      body: 'Hello my friends ...'
    });
  }
}
export default Contact;
