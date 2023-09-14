import React, {Component} from 'react';

import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Spinner,
  Button,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RNFetchBlob from 'rn-fetch-blob';
import basic from './BasicURL';
import {color} from '../color';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';

const {width, height} = Dimensions.get('window');

export default class AddSummery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generation_id: this.props.navigation.getParam('generation_id'),
      summery_name: '',
      link: '',

      path: '',
      loading: false,
      file: null,
      subject_id: this.props.navigation.getParam('subject_id'),
    };
  }

  componentWillUnmount() {
    let refrish = this.props.navigation.getParam('refrish');
    refrish();
  }

  componentDidMount() {}

  uploadFile = async () => { 

    this.setState({loading: true});
    let data_to_send = {
      zoom_name: this.state.summery_name,
      zoom_link: this.state.link,
     
      subject_id: this.state.subject_id,
    };
    axios.post(basic.url + `admin/insert_zoom_links.php`, data_to_send).then((res) => {
      if (res.status == 200) {
        console.log(res.data)
        if (res.data == 'success') {
          this.setState({isChange: true});
          this.props.navigation.goBack();
          Alert.alert('أدمن', 'تمت إضافة اللينك بنجاح');
        } else {
          Alert.alert('أدمن', 'خطأ');
        }
      } else {
        Alert.alert('أدمن', 'خطأ');
      }
      this.setState({loading: false});
    });
  



  };

  render() {
    return (
      <>
        <Header style={{backgroundColor: color}} androidStatusBarColor={color}>
          <Left style={{flex: 1}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                name="angle-right"
                size={25}
                style={{paddingRight: 10, paddingLeft: 10, color: '#FFF'}}
              />
            </TouchableOpacity>
          </Left>

          <Body style={{flex: 3, alignItems: 'center'}}>
            <Title>إضافة ملخص</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <Container>
          <ScrollView>
            <View style={{paddingVertical: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderColor: '#ddd',
                  borderWidth: 1,
                  width: '90%',
                }}>
                <TextInput
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    height: 50,
                    width: '90%',
                    // paddingLeft: 5,
                  }}
                  multiline={true}
                  placeholder="الاسم"
                  placeholderTextColor="#000"
                  onChangeText={(text) => {
                    this.setState({summery_name: text});
                  }}
                  value={this.state.summery_name}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderColor: '#ddd',
                  borderWidth: 1,
                  width: '90%',
                  marginTop: 15,
                  marginBottom:10

                }}>
                <TextInput
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    height: 50,
                    width: '90%',
                  }}
                  multiline={true}
                  placeholder="اللينك"
                  placeholderTextColor="#000"
                  onChangeText={(text) => {
                    this.setState({link: text});
                  }}
                  value={this.state.link}
                />
              </View>


             
             

              <Button
                disabled={this.state.loading}
                onPress={() => {
                  this.uploadFile();
                }}
                style={{
                  width: '90%',
                  backgroundColor: color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 60,
                  alignSelf: 'center',
                }}>
                {this.state.loading == false ? (
                  <Text
                    style={{
                      fontSize: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#FFF',
                    }}>
                    اضافة
                  </Text>
                ) : (
                  <Spinner
                    color="#fff"
                    size={26}
                    style={{
                      alignSelf: 'center',
                      padding: 0,
                    }}
                  />
                )}
              </Button>

              <TouchableOpacity
                style={{
                  width: '90%',
                  backgroundColor: '#ddd',
                  justifyContent: 'center',
                  marginTop: 20,
                  alignSelf: 'center',
                  height: 45,
                }}
                disabled={this.state.loading}
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 20,
                    textAlign: 'center',
                  }}>
                  الغاء
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Container>
      </>
    );
  }
}
