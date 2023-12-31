import React, { Component } from 'react';
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
  AppRegistry,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Container,
  Picker,
  Form,
  Spinner,
  Header,
  Left,
  Right,
  Body,
  Title,
} from 'native-base';
import { SearchBar, Avatar, Badge, withBadge } from 'react-native-elements';
import { Hoshi } from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/FontAwesome5';
const { width, height } = Dimensions.get('window');
// import { Searchbar } from 'react-native-paper';
import axios from 'axios';
import basic from './BasicURL'
import { color } from '../color'
import { StatusBar } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Headroom from 'react-native-headroom'



export default class Students extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      data: [],
      generation_id: 'no',
      collectiont_id: 'no',
      NumberOfStudent: '',
      status: 'approved',
      searchQuery: '',
      loading: false,
      loading_dele: [false],
      loading_add: [false],
      profileImage:
        'https://www.essentiallysports.com/wp-content/uploads/IMG_20191230_233458.jpg',
    };
  }

  componentDidMount() {
    this._studentdata();
    // let searchdata = this.state.data;
    // for (let i = 0; i < searchdata.length; i++) {
    //   searchdata[i].view = true;
    // }
    let NumOfStudentPending = this.props.navigation.getParam(
      'NumOfStudentPending',
    );

    this.setState({
      NumOfStudentPending: NumOfStudentPending,
    });
  }

  allert_delete_student(index, studentName) {
    Alert.alert(
      "ادمن",
      "هل أنت متأكد من إزاله الطالب ( " + studentName + " )",
      [
        {
          text: "الغاء",
          onPress: () => console.log("cansel Pressed"),

        },
        {
          text: "مسح", onPress: () => this.dele(index)
        }
      ],
      { cancelable: false }
    );
  }
  _studentdata = () => {
    this.setState({ loading: true });
    let generation_id = this.props.navigation.getParam('generation_id');
    let collectiont_id = this.props.navigation.getParam('collectiont_id');
    let status = this.props.navigation.getParam('status');

    let data_to_send = {
      generation_id: generation_id,
      collectiont_id: collectiont_id,
      status: status,
    };

    axios
      .post(
        basic.url + 'admin/select_students.php',
        data_to_send,
      )
      .then(res => {
        if (res.status == 200) {
          // console.log(res.data);
          if (res.data == 'error') {
            Alert.alert('مرحبا', 'هناك خطأ ما في اتسترجاع البينات ');
          } else {
            this.setState({
              data: res.data.students,
              students: res.data.students,
            });
          }
        } else {
          alert('error');
        }
        this.setState({ loading: false });
      });
  };

  dele = index => {
    // alert(index)
    let load = this.state.loading_dele;
    load[index] = true;
    this.setState({ loading_dele: load });
    let data_to_send = {
      student_id: this.state.data[index].student_id,
    };
    console.log(data_to_send);
    axios
      .post(
        basic.url + 'admin/delete.student.php',
        data_to_send,
      )
      .then(res => {
        if (res.status == 200) {
          console.log(res.data);
          if (res.data == 'error') {
            Alert.alert('أدمن', 'هناك خطأ اعد المحاوله لاحقا');
          } else {
            let list = this.state.data;
            let list2 = this.state.students;
            // console.log(list2.length)
            let position = 0;

            for (let i = 0; i < list2.length; i++) {
              // console.log(
              //   i + ' // ' + list2[i].student_id + '==' + list[index].student_id
              // );
              if (list2[i].student_id == list[index].student_id) {
                position = i;
                break;
              }
            }
            // console.log(this.state.data);
            // console.log(list);
            if (
              position != 0 ||
              (position == 0 && this.state.searchQuery != '')
            ) {
              if (position == index) {
                // list2.splice(position, 1);
                list.splice(index, 1);
                this.setState({
                  data: list,
                  students: list,
                });
              } else {
                list2.splice(position, 1);
                list.splice(index, 1);
                this.setState({
                  data: list,
                  students: list2,
                });
              }
            } else if (position == 0 && this.state.searchQuery == '') {
              // list2.splice(position, 1);
              list.splice(index, 1);
              this.setState({
                data: list,
                students: list,
              });
            }
            Alert.alert('أدمن', 'لقد تمت الازله بنجاح');
          }
        } else {
          Alert.alert('أدمن', 'هناك خطأ اعد المحاوله لاحقا');
        }

        let load = this.state.loading_dele;
        load[index] = false;
        this.setState({ loading_dele: load });
      });
  };

  add = index => {
    // console.log(list.length);

    let load = this.state.loading_add;
    load[index] = true;
    this.setState({ loading_add: load });

    let data_to_send = {
      student_id: this.state.data[index].student_id,
      value: 'approved',
    };
    axios
      .post(
        basic.url + 'admin/approve_student.php',
        data_to_send,
      )
      .then(res => {
        if (res.status == 200) {
          if (res.data == 'success') {
            let list = this.state.data;
            let list2 = this.state.students;
            // console.log(list2.length)
            let position = 0;

            for (let i = 0; i < list2.length; i++) {
              // console.log(
              //   i + ' // ' + list2[i].student_id + '==' + list[index].student_id
              // );
              if (list2[i].student_id == list[index].student_id) {
                position = i;
                break;
              }
            }
            // console.log(this.state.data);
            // console.log(list);
            if (
              position != 0 ||
              (position == 0 && this.state.searchQuery != '')
            ) {
              if (position == index) {
                // list2.splice(position, 1);
                list.splice(index, 1);
                this.setState({
                  data: list,
                  students: list,
                });
              } else {
                list2.splice(position, 1);
                list.splice(index, 1);
                this.setState({
                  data: list,
                  students: list2,
                });
              }
            } else if (position == 0 && this.state.searchQuery == '') {
              // list2.splice(position, 1);
              list.splice(index, 1);
              this.setState({
                data: list,
                students: list,
              });
            }
            Alert.alert('أدمن', 'تمت الاضافه بنجاح');
          } else {
            Alert.alert('أدمن', 'هناك خطأ اعد المحاوله لاحقا');
          }
        } else {
          Alert.alert('أدمن', 'هناك خطأ اعد المحاوله لاحقا');
        }

        let load = this.state.loading_add;
        load[index] = false;
        this.setState({ loading_add: load });
      });
  };
  componentWillUnmount() {
    let testPage = this.props.navigation.getParam('testPage');

    if (testPage == 0) {
      const { state } = this.props.navigation;
      const params = state.params;

      params._refreshPages();
    }
  }

  onChangeSearch = searchQuery => {
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

    this.setState({ data: data });
  };




  renderStudents = ({ item, index }) => {
    return (
      <View
        style={{
          width: width * 0.85,
          backgroundColor: 'white',
          borderRadius: 5,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          padding: 10,
        }}>
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          <Image
            style={{
              width: 100,
              height: 100,
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 5,
            }}
            source={require('../images/AllStudent.png')}
          />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                textAlign: 'center',
                alignSelf: 'center',
                fontSize: 18,
                fontWeight: '600',
                marginTop: 5,
              }}>
              {item.student_name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '300',
                marginTop: 5,
              }}>
              {item.generation_name}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '300',
                marginTop: 5,
              }}>
              {item.collection_name}
            </Text>

          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.add(index);
            }}
            style={{ width: '40%' }}
            disabled={this.state.loading_add[index]}>
            <View
              style={{
                width: '95%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: '#00B859',
                alignSelf: 'center',
                borderRadius: 5,
                marginBottom: 5,
                marginTop: 5,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,

              }}>
              {this.state.loading_add[index] ? (
                <Spinner
                  color="#fff"
                  size={26}
                  style={{
                    alignSelf: 'center',
                    padding: 0,
                    marginTop: 0,
                  }}
                />
              ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontFamily: 'Metropolis',
                      fontStyle: 'normal',
                    }}>
                    اضافه
                  </Text>
                )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: '40%' }}
            onPress={() => {
              this.allert_delete_student(index, item.student_name)

            }}
            disabled={this.state.loading_dele[index]}>
            <View
              style={{
                width: '95%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: '#B82700',
                alignSelf: 'center',
                borderRadius: 7,
                marginBottom: 5,
                marginTop: 5,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,

              }}>
              {this.state.loading_dele[index] ? (
                <Spinner
                  color="#fff"
                  size={26}
                  style={{
                    alignSelf: 'center',
                    padding: 0,
                    marginTop: 0,
                  }}
                />
              ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontFamily: 'Metropolis',
                      fontStyle: 'normal',
                    }}>
                    ازاله
                  </Text>
                )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

    )
  }

  render() {
    const header = (
      <SearchBar
        lightTheme
        placeholder="اسم الطالب"
        onChangeText={query => {
          this.setState({ searchQuery: query });
          this.onChangeSearch(query);
        }}
        value={this.state.searchQuery}
      />

    )
    return (
      <View style={{ flex: 1, alignItems: 'center' }} >
        {/********************************************************************************              Header                ***************************************************************************************************************** */}

        <StatusBar backgroundColor={color} />
        <View style={{ width: '100%', height: 60, flexDirection: 'row', backgroundColor: color, elevation: 22 }} >
          <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
            this.props.navigation.goBack();
          }}>

            <Icon
              name="angle-right"
              size={35}
              style={{  color: '#fff', marginRight: 20 }}
            />

          </TouchableOpacity>


          <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#F5FCFF', fontSize: 17, fontWeight: 'bold' }} >القائمه الحاليه</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={require("../images/student.png")}
              style={{ width: 50, height: 50 }}
            />
            <Badge
              status="success"
              value={this.state.data.length}
              containerStyle={{ position: 'absolute', top: -0.1, right: 50 }}
            />
          </View>

        </View>
        {/** ******************************************************************************************************************************************************************************************************************** */}
        {

          this.state.loading == true ? (
            <Spinner color={color} size={40} style={{ marginTop: 200 }} />

          ) : (
              <Headroom
                // style={[styles.container]}
                headerComponent={header}
                ScrollableComponent={ScrollView}
                headerHeight={80}
                scrollEventThrottle={80}
                slideDuration={1000}
              >
                {this.state.data.length == 0 ? (
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
                      لا يوجد طلاب
              </Text>
                  </View>
                ) : (


                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={this.state.data}
                      renderItem={this.renderStudents}
                      keyExtractor={(i, k) => k.toString()}

                    />


                  )}
              </Headroom>

            )
        }


      </View>
    );
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loremIpsum: {
    fontSize: 24,
  },
})
