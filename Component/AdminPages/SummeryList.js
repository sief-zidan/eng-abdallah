import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
  AsyncStorage,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Spinner,
  Fab,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import Icon2 from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import basic from './BasicURL';
import {color} from '../color';

const {width, height} = Dimensions.get('window');

export default class SummaryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      generation_id: this.props.navigation.getParam('generation_id'),
      //   student_id: "",
      summary: [],
      loading: true,
      subject_id: this.props.navigation.getParam('subject_id'),
    };
  }

  componentDidMount() {
    // console.log("called")
    this.get_summary();
  }

  get_summary = () => {
    // this.setState({disabled: true});
    // this.setState({ loading: true });
    let data_to_send = {
      generation_id: this.state.generation_id,
      subject_id: this.state.subject_id,
    };
    // console.log(data_to_send);
    axios.post(basic.url + `student/home/select_summary.php`, data_to_send).then((res) => {
      if (res.status == 200) {
        // console.log(JSON.stringify(res.data));
        if (res.data != 'error') {
          if (res.data.summary.length > 0) {
            this.setState({
              summary: res.data.summary,
            });
            // console.log(this.state.exams)
          } else {
            this.setState({
              summary: [],
            });
          }
        } else {
          Alert.alert('أدمن', 'عذرا يرجي المحاولة في وقت لاحق');
        }
      } else {
        Alert.alert('أدمن', 'عذرا يرجي المحاولة في وقت لاحق');
      }
      this.setState({loading: false});
    });
  };

  delete_summary(item, index) {
    let data_to_send = {
      summary_id: item.summary_id,
      subject_id: this.state.subject_id,
    };

    let summary = this.state.summary;

    axios
      .post(basic.url + `admin/delete_summary.php`, data_to_send)
      .then((res) => {
        if (res.data == 'success') {
          ToastAndroid.showWithGravityAndOffset(
            'تم مسح الملخص بنجاح',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            0,
            150,
          );

          summary.splice(index, 1);

          this.setState({summary: summary});
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'حدث خطأ ما',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            0,
            150,
          );
        }
      });
  }

  render() {
    return (
      <Container style={{backgroundColor: '#f7f7f7'}}>
        <Header style={{backgroundColor: color}} androidStatusBarColor={color}>
          <Left style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Icon
                name="arrow-right"
                style={{fontSize: 25, color: '#fff', marginLeft: 10}}
              />
            </TouchableOpacity>
          </Left>
          <Body
            style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
            <Title
              numberOfLines={2}
              style={{
                fontSize: 17,
                fontFamily: 'serif',
                alignSelf: 'center',
                textAlign: 'center',
              }}>
              الملخصات
            </Title>
          </Body>
          <Right />
        </Header>
        {
          // <Text>{item.exam_name}</Text>
        }
        {this.state.loading == true ? (
          <Spinner color={color} size={40} style={{marginTop: 200}} />
        ) : (
          <View>
            {this.state.summary.length == 0 ? (
              <View
                style={{
                  width: width,
                  height: height - 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: color,
                  }}>
                  لا يوجد ملخصات
                </Text>
              </View>
            ) : (
              <View style={{marginVertical: 15}}>
                <ScrollView>
                  <FlatList
                    data={this.state.summary}
                    renderItem={({item, index}) => (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity
                            style={{
                              width: '90%',
                              alignSelf: 'center',
                              paddingHorizontal: 12,
                              paddingVertical: 15,
                              borderRadius: 7,
                              backgroundColor: '#fff',
                              marginBottom: 10,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                            onLongPress={() => {
                              Alert.alert(
                                'أدمن',
                                'هل أنت متأكد من مسح الملخص ؟',
                                [
                                  {
                                    text: 'نعم',
                                    onPress: () =>
                                      this.delete_summary(item, index),
                                  },

                                  {
                                    text: 'لا',
                                    onPress: () => {},
                                  },
                                ],
                                {cancelable: false},
                              );
                            }}
                            onPress={() => {
                              this.props.navigation.navigate('Viewer', {
                                sum_name: item.summary_name,
                                sum_link: item.summary_link,
                                refrish: this.componentDidMount,
                              });
                            }}>
                            <View
                              style={{
                                flex: 4,
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                              }}>
                              <Text style={{fontSize: 22, color: '#444'}}>
                                {item.summary_name}
                              </Text>
                            </View>

                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                              }}>
                              <Icon
                                name="file"
                                style={{
                                  fontSize: 30,
                                  color: '#006AB8',
                                  marginLeft: 10,
                                }}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  />
                  <View style={{width: '100%', height: 80}}></View>
                </ScrollView>
              </View>
            )}
          </View>
        )}

        <Fab
          direction="up"
          // containerStyle={{}}
          style={{backgroundColor: color, marginRight: 10}}
          position="bottomRight"
          onPress={() =>
            this.props.navigation.navigate('AddSummery', {
              generation_id: this.state.generation_id,
              refrish: this.get_summary,
              subject_id: this.state.subject_id,
            })
          }>
          <Icon name="plus" style={{fontSize: 30}} color="#FFF" />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
