import React, {Component} from 'react';

import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
  Image,
  FlatList,
  Dimensions,
  Modal,
  ActivityIndicator,
  Picker,
  ToastAndroid,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Toast,
  Spinner,
} from 'native-base';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';

import basic from './BasicURL';
import {color} from '../color';

const {width, height} = Dimensions.get('window');

// var DESTRUCTIVE_INDEX = 1;
// var CANCEL_INDEX = 6;

export default class ChapterQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapter_id: this.props.navigation.getParam('chapter_id'),
      questions: [],
      loading: true,
      delete_loading: [],
      visableAddQueToChap: false,
      requestLoading: false,
    };

    this.flatListRef = null;
    this.scroll_to_index = this.scroll_to_index.bind(this);
  }

  componentDidMount() {
    this.get_questions();
  }

  scrollToIndexFailed(error) {
    const offset = error.averageItemLength * error.index;
    this.flatListRef.scrollToOffset({offset});
    setTimeout(() => {
      this.flatListRef.scrollToIndex({index: error.index});
    }, 2500);
  }

  scroll_to_index(scrollTo) {
    setTimeout(() => {
      this.flatListRef.scrollToIndex({animated: true, index: scrollTo});
    }, 400);
  }

  get_questions = (question_index) => {
    this.setState({loading: true});
    let data_to_send = {
      chapter_id: this.state.chapter_id,
    };
    axios
      .post(basic.url + `challenge/select_Question_chapter.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data != 'error') {
            if (res.data.questions.length > 0) {
              let delete_loding_copy = this.state.delete_loading;
              for (let i = 0; i < res.data.questions.length; i++) {
                delete_loding_copy[i] = false;
              }
              this.setState({
                questions: res.data.questions,
                delete_loading: delete_loding_copy,
              });
              if (question_index * 0 == 0) {
                this.scroll_to_index(question_index);
              }
            } else {
              // Alert.alert('أدمن', 'لا يوجد أسئلة');
            }
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        } else {
          Alert.alert('أدمن', 'حدث شئ خطأ');
        }
        this.setState({loading: false});
      });
  };
  allert(index) {
    Alert.alert(
      'ادمن',

      ' هل انت متاكد من حذف السؤال ',
      [
        {
          text: 'الغاء',
          onPress: () => console.log('cansel Pressed'),
        },
        {
          text: 'تأكيد',
          onPress: () => this.delete_question(index),
        },
      ],
      {cancelable: false},
    );
  }
  delete_question(index) {
    let loading_delete = this.state.delete_loading;
    loading_delete[index] = true;
    this.setState({delete_loading: loading_delete});
    let data_to_send = {
      question_id: this.state.questions[index].question_id,
    };

    axios
      .post(basic.url + `challenge/delete_question_testBank.php`, data_to_send)
      .then((res) => {
        console.log(res.data);
        if (res.data != 'error') {
          const OriginalArray = this.state.questions;

          OriginalArray.splice(index, 1);
          loading_delete.splice(index, 1);

          this.setState({
            questions: OriginalArray,
            delete_loading: loading_delete,
          });
          Toast.show({
            text: 'تم مسح السؤال بنجاح',
            buttonText: 'شكرا',
            textStyle: {color: '#FFF'},
            buttonTextStyle: {color: '#FFF'},
            type: 'danger',
            duration: 7000,
          });
        } else {
          //   Alert.alert(')
          loading_delete[index] = false;
          this.setState({delete_loading: loading_delete});
        }
      });
  }

  edit_question(index) {
    this.props.navigation.navigate('AddEditQuestionToChapter', {
      chapter_id: this.state.chapter_id,
      question_obj: this.state.questions[index],
      changeButton: false,
      refrish: this.get_questions,
      // scroll_to_index: this.scroll_to_index,
      question_index: index,
    });
  }
  add_ques() {
    let index = this.state.questions.length;

    this.props.navigation.navigate('AddEditQuestionToChapter', {
      chapter_id: this.state.chapter_id,
      question_obj: {
        question_id: 0,
        question_text: '',
        question_image: null,
        question_answers: [],
        question_valid_answer: '',
      },
      changeButton: true,
      refrish: this.get_questions,
      // scroll_to_index: this.scroll_to_index,
      question_index: index,
    });
  }

  render_question(item, index) {
    return (
      <View
        style={{
          width: '95%',
          borderWidth: 2,
          borderColor: '#ddd',
          borderRadius: 5,
          padding: 5,
          alignSelf: 'center',
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}>
          <Text
            style={{
              borderRadius: 5,
              backgroundColor: color,
              color: '#fff',
              fontSize: 18,
              paddingVertical: 2,
              paddingHorizontal: 10,
            }}>
            {index + 1}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '20%',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.edit_question(index);
              }}
              disabled={this.state.delete_loading[index]}>
              <Icon
                name="edit"
                size={22}
                style={{
                  paddingRight: 2,
                  paddingLeft: 2,
                  color:
                    this.state.delete_loading[index] == false ? '#0f0' : '#fff',
                }}
              />
            </TouchableOpacity>
            {this.state.delete_loading[index] == false ? (
              <TouchableOpacity
                onPress={() => {
                  this.allert(index);
                }}>
                <Icon
                  name="trash"
                  size={22}
                  style={{paddingRight: 2, paddingLeft: 2, color: '#F00'}}
                />
              </TouchableOpacity>
            ) : (
              <Spinner
                color="#f00"
                size={22}
                style={{
                  // alignSelf: 'center',
                  padding: 0,
                  height: 22,
                  //   marginTop: -20,
                  // backgroundColor:'#f00'
                }}
              />
            )}
          </View>
        </View>

        <Text
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            fontSize: 18,
            marginTop: 10,
          }}>
          {item.question_text}
        </Text>

        {item.question_image != null ? (
          <Image
            source={{uri: item.question_image}}
            style={{
              width: '90%',
              height: 200,
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 15,
              marginBottom: 5,
              resizeMode: 'stretch',
            }}
          />
        ) : null}
        <View
          style={{
            marginTop: 15,
          }}>
          {item.question_answers.map((answer_text) => (
            <Text
              style={{
                width: '90%',
                alignSelf: 'center',
                borderWidth: 2,
                borderRadius: 5,
                borderColor: '#999',
                backgroundColor:
                  answer_text.answer_text == item.question_valid_answer
                    ? '#72ef72'
                    : '#fff',
                color:
                  answer_text.answer_text != item.question_valid_answer
                    ? '#333'
                    : '#fff',
                paddingVertical: 5,
                paddingHorizontal: 10,
                marginBottom: 3,
                fontSize: 18,
              }}>
              {answer_text.answer_text}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  render() {
    return (
      <>
        <Header style={{backgroundColor: color}} androidStatusBarColor={color}>
          <Left style={{flex: 1}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                name="angle-right"
                size={35}
                style={{paddingRight: 10, paddingLeft: 10, color: '#FFF'}}
              />
            </TouchableOpacity>
          </Left>

          <Body style={{flex: 3, alignItems: 'center'}}>
            <Title>الأسئلة</Title>
          </Body>
          <Right style={{flex: 1}}>
            {/* <TouchableOpacity onPress={() => this.add_ques()}>
              <Icon
                name="plus"
                size={25}
                style={{paddingRight: 10, paddingLeft: 10, color: '#fff'}}
              />
            </TouchableOpacity> */}
          </Right>
        </Header>
        <Container>
          {this.state.loading == true ? (
            <Spinner color={color} size={40} style={{marginTop: 200}} />
          ) : (
            <View>
              {this.state.questions.length == 0 ? (
                <View
                  style={{
                    width: width,
                    height: height - 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 22,
                      color: color,
                    }}>
                    لم يتم إضافة أسئله بعد
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>
                  <FlatList
                    ref={(ref) => {
                      this.flatListRef = ref;
                    }}
                    removeClippedSubviews={false}
                    enableEmptySections={false}
                    data={this.state.questions}
                    renderItem={({item, index}) =>
                      this.render_question(item, index)
                    }
                    keyExtractor={(item) => item.question_id}
                    initialNumToRender={2}
                    onScrollToIndexFailed={this.scrollToIndexFailed.bind(this)}
                    // getItemLayout={(data, index) => {
                    //   console.log(index)
                    //        // { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                    //       }
                    // }
                    style={{
                      width: '100%',
                      // alignItems:"center",
                    }}
                  />
                </View>
              )}
            </View>
          )}
        </Container>
      </>
    );
  }
}
