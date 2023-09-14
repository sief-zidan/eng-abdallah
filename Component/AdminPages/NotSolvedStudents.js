import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Spinner,
} from 'native-base';
// import {Hoshi} from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/FontAwesome5';
const {width, height} = Dimensions.get('window');
import axios from 'axios';
import {Searchbar} from 'react-native-paper';
import basic from './BasicURL';
import {color} from '../color';

export default class NotSolvedStudents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exam_id: 'Exam_1',
      data: [],
      students: [],
      loading: true,
      searchQuery: '',
      subject_id: this.props.navigation.getParam('subject_id'),
    };
  }

  componentDidMount() {
    this.info();
  }
  info = () => {
    this.setState({loading: true});
    let exam_id = this.props.navigation.getParam('exam_id');
    let generation_id = this.props.navigation.getParam('generation_id');
    let test_id = this.props.navigation.getParam('test_id');
    let send_collection_id = this.props.navigation.getParam('collection_id');
    // let generation_id = this.props.navigation.getParam('generation_id');
    let data_to_send = {
      exam_id: test_id == 1 ? 'Exam_' + exam_id : 'Quiz_' + exam_id,
      collection_id: send_collection_id,
      generation_id: generation_id,
      subject_id: this.state.subject_id,
    };

    // console.log(data_to_send)

    axios
      .post(basic.url + 'doctor/home/select_who_not_solved.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // console.log(res.data)
          if (res.data == 'error') {
            Alert.alert('أدمن', 'هناك خطأ ما في اتسترجاع بينات المتحان');
          } else {
            this.setState({
              data: res.data.students,
              students: res.data.students,
            });
          }
        } else {
          alert('error');
        }

        this.setState({loading: false});
      });
  };

  onChangeSearch = (searchQuery) => {
    // let searchQuery = this.state.searchQuery;

    let list = this.state.students;
    let data = [];
    for (let i = 0; i < list.length; i++) {
      // console.log(list[i].student_name.startsWith(searchQuery))
      // console.log(searchQuery)
      if (
        list[i].student_name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        data.push(list[i]);
      }
    }

    this.setState({data: data});
  };

  render() {
    return (
      <Container
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#EAEAEA',
          // alignItems: 'center',
          // justifyContent: 'center',
        }}>
        <Header style={{backgroundColor: color}} androidStatusBarColor={color}>
          <Left style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Icon
                name="angle-right"
                style={{fontSize: 26, color: '#fff', marginLeft: 10}}
              />
            </TouchableOpacity>
          </Left>
          <Body
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Title style={{fontSize: 20, fontFamily: 'serif'}}>
              من لم يحل بعد
            </Title>
          </Body>
          <Right />
        </Header>
        <ScrollView>
          {this.state.loading == true ? (
            <Spinner color={color} size={40} style={{marginTop: 200}} />
          ) : (
            <View>
              {this.state.data == null ? (
                <View
                  style={{
                    width: width,
                    height: height - 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: color,
                    }}>
                    لا يوجد طلاب بعد
                  </Text>
                </View>
              ) : (
                <View style={{paddingHorizontal: 10, paddingVertical: 15}}>
                  <Searchbar
                    placeholder="اسم الطالب"
                    onChangeText={(query) => {
                      this.setState({searchQuery: query});
                      this.onChangeSearch(query);
                    }}
                    value={this.state.searchQuery}
                    style={{
                      width: '95%',
                      marginBottom: 0,
                      alignSelf: 'center',
                    }}
                  />
                  <View
                    style={{
                      width: '95%',
                      flexDirection: 'row',
                      marginTop: 25,
                      // height: height * 0.05,
                      marginBottom: 5,
                      alignSelf: 'center',
                      // backgroundColor:"#000"
                    }}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        width: '20%',
                        justifyContent: 'center',
                        borderTopStartRadius: 20,
                        borderBottomStartRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 0.37,
                        shadowRadius: 7.49,
                        borderRightWidth: 2,
                        borderRightColor: '#000',
                        elevation: 12,
                        paddingVertical: 10,
                      }}>
                      <Icon
                        name="award"
                        style={{
                          fontSize: 20,
                          color: '#000',
                          alignSelf: 'center',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        backgroundColor: 'white',
                        width: '80%',
                        borderRightWidth: 2,
                        justifyContent: 'center',
                        // borderBottomStartRadius: 20,
                        // borderTopStartRadius: 20,
                        borderTopEndRadius: 20,
                        borderBottomEndRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 0.37,
                        shadowRadius: 7.49,

                        elevation: 12,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        اسم الطالب
                      </Text>
                    </View>

                    {/* <View
                      style={{
                        backgroundColor: 'white',
                        width: '25%',
                        justifyContent: 'center',
                        borderTopEndRadius: 20,
                        borderBottomEndRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 0.37,
                        shadowRadius: 7.49,

                        elevation: 12,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        المجموع
                      </Text>
                    </View>*/}
                  </View>

                  {this.state.data.map((str, index) => {
                    return (
                      <View
                        style={{
                          width: '95%',
                          flexDirection: 'row',
                          marginTop: 5,
                          // height: height * 0.05,
                          marginBottom: 5,
                          alignSelf: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: 'white',
                            width: '20%',
                            justifyContent: 'center',
                            borderTopStartRadius: 20,
                            borderBottomStartRadius: 20,
                            shadowColor: '#000',
                            shadowOffset: {
                              width: 0,
                              height: 6,
                            },
                            shadowOpacity: 0.37,
                            shadowRadius: 7.49,
                            borderRightWidth: 2,
                            borderRightColor: '#000',
                            elevation: 12,
                            paddingVertical: 10,
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              color: '#000',
                              alignSelf: 'center',
                            }}>
                            {str.position}
                          </Text>
                        </View>

                        <View
                          style={{
                            padding: 10,
                            backgroundColor: 'white',
                            width: '80%',
                            borderRightWidth: 2,
                            justifyContent: 'center',
                            // borderBottomStartRadius: 20,
                            // borderTopStartRadius: 20,
                            borderTopEndRadius: 20,
                            borderBottomEndRadius: 20,
                            shadowColor: '#000',
                            shadowOffset: {
                              width: 0,
                              height: 6,
                            },
                            shadowOpacity: 0.37,
                            shadowRadius: 7.49,

                            elevation: 12,
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 16,
                              // fontWeight: 'bold',
                            }}>
                            {str.student_name}
                          </Text>
                        </View>

                        {/* <View
                      style={{
                        backgroundColor: 'white',
                        width: '25%',
                        justifyContent: 'center',
                        borderTopEndRadius: 20,
                        borderBottomEndRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 0.37,
                        shadowRadius: 7.49,

                        elevation: 12,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 16,
                          // fontWeight: 'bold',
                        }}>
                        {str.score}
                      </Text>
                    </View> */}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </Container>
    );
  }
}
