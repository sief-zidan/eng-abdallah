import * as React from 'react';
import {StatusBar} from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  // Animated,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  FlatList,
  // AsyncStorage,
  ImageBackground,
  Alert,
  ToastAndroid,
  Modal,
  // Button,
  Image,
} from 'react-native';
import {Header, Left, Right, Body, Title, Spinner} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput, Switch} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

import {RefreshControl} from 'react-native';

import basic from './BasicURL';
import {color} from '../color';

const {width, height} = Dimensions.get('window');
export default class VideosList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      My_videos_array: [],
      loading_lock: [],
      isPageLoading: true,
      unableWatchModal: false,
      alertBeforeWatchingModal: false,
      vedio_details: null,
      wrongModal: false,
      WrongModalReason: '',
      thereIsVideos: false,
      checkInsertViewFun: false,
      //
      visableAddVideo: false,
      chain_name: '',
      description: '',
      chain_price: '',
      filePath: null,
      change_photo: false,
      chain_id: '',
      chain_date: '',
      // viemo_id: '',
      requestLoading: false,
      addOreditVideo: 'add',
      selectedItem: {},
      selectedItemIndex: 0,
      visableActionSheet: false,
      selected_video: {},
      selected_video_index: {},
      subject_id: this.props.navigation.getParam('subject_id'),
    };
  }

  componentDidMount() {
    this.setState({isPageLoading: true});

    this.getAllMyVediosFor();
  }

  chooseFile = () => {
    var options = {
      title: 'Select Image',

      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        let source = response;
        // let obj = this.state.question_obj
        // obj.question_image = source.uri

        this.setState({
          filePath: source,
          // question_obj: obj,
          change_photo: true,
        });
      }
    });
  };
  closeModal() {
    this.setState({
      requestLoading: false,
      visableAddVideo: false,
      chain_name: '',
      description: '',
      // viemo_id: '',
      selectedItem: {},
      addOreditVideo: 'add',
      selectedItemIndex: 0,
      chain_price: '',
      filePath: null,
      change_photo: false,
    });
  }

  async toggleVideoToBuy() {
    let video = this.state.selected_video;
    let video_index = this.state.selected_video_index;
    let can_buy = this.state.selected_video.can_buy;

    let data_to_send = {
      chain_id: video.chain_id,
      subject_id: this.state.subject_id,
    };

    axios
      .post(basic.url + 'admin/update_buy_video.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            let allData = this.state.My_videos_array;
            allData[video_index].can_buy = can_buy == '1' ? '0' : '1';
            video.can_buy = can_buy == '1' ? '0' : '1';
            this.setState({
              My_videos_array: allData,
              selected_video: video,
            });
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'حدث خطأ ما الرجاء المحاولة فى وقت لاحق',
              ToastAndroid.BOTTOM,
              ToastAndroid.SHORT,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'حدث خطأ ما الرجاء المحاولة فى وقت لاحق',
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
            25,
            50,
          );
        }
      });
  }
  async addVideo() {
    console.log(this.state.filePath == null);
    this.setState({
      requestLoading: true,
    });

    let chain_name = this.state.chain_name.trim();
    let description = this.state.description.trim();
    let chain_price = this.state.chain_price.trim();

    // let viemo_id = this.state.viemo_id.trim();

    let error = 0;

    if (chain_name.length == 0) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء كتابة عنوان للسلسلة',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }

    if (description.length == 0) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء كتابة وصف للسلسلة',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }

    if (chain_price.length == 0) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء إدخال ثمن السلسلة',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }

    if (this.state.filePath == null) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء إدراج صورة خاصة للسلسلة',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
    //  else if (viemo_id.length == 0) {
    //   error++;
    //   ToastAndroid.showWithGravityAndOffset(
    //     'الرجاء كتابة ال ID الخاص بالفيديو',
    //     ToastAndroid.SHORT,
    //     ToastAndroid.BOTTOM,
    //     25,
    //     50,
    //   );
    // }

    if (error == 0) {
      let obj = {
        data: this.state.filePath['data'],
        chain_name,
        description,
        preview_photo: this.state.filePath == null ? null : '1',
        chain_generation_id: this.props.navigation.getParam('generation_id'),
        subject_id: this.state.subject_id,
      };
      console.log(JSON.stringify(obj));
      RNFetchBlob.fetch(
        'POST',
        basic.url + 'admin/add_chain.php',
        {
          Authorization: 'Bearer access-token',
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'image',
            filename: 'avatar.png',
            type: 'image/png',
            data: this.state.filePath['data'],
          },
          {
            name: 'chain_name',
            data: chain_name,
          },

          {
            name: 'description',
            data: description,
          },
          {
            name: 'preview_photo',
            data: this.state.filePath == null ? null : '1',
          },
          {
            name: 'chain_price',
            data: chain_price,
          },
          {
            name: 'chain_generation_id',
            data: this.props.navigation.getParam('generation_id'),
          },
          {
            name: 'subject_id',
            data: this.state.subject_id,
          },
        ],
      )
        .then((resp) => {
          let data = resp.data.trim();

          if (data == '"success"') {
            ToastAndroid.showWithGravityAndOffset(
              'تمت الإضافة بنجاح',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            this.componentDidMount();
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        })
        .finally(() => {
          this.closeModal();
        });
    } else {
      this.setState({
        requestLoading: false,
      });
    }
  }

  async editVideo() {
    this.setState({
      requestLoading: true,
    });
    let itemIndex = this.state.selectedItemIndex;
    let allData = this.state.My_videos_array;
    allData[itemIndex].editLoading = true;
    this.setState({
      My_videos_array: allData,
    });

    let chain_name = this.state.chain_name.trim();
    let description = this.state.description.trim();
    let chain_price = this.state.chain_price.trim();

    // let viemo_id = this.state.viemo_id.trim();
    let error = 0;
    if (chain_name.length == 0) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء كتابة عنوان للسلسلة',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
    if (description.length == 0) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء كتابة وصف للسلسلة',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }

    if (chain_price.length == 0) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء إدخال ثمن السلسلة',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }

    if (this.state.filePath == null) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء إدراج صورة خاصة للسلسلة',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
    //  else if (viemo_id.length == 0) {
    //   error++;
    //   ToastAndroid.showWithGravityAndOffset(
    //     'الرجاء كتابة ال ID الخاص بالفيديو',
    //     ToastAndroid.SHORT,
    //     ToastAndroid.BOTTOM,
    //     25,
    //     50,
    //   );
    // }

    if (error == 0) {
      let obj = {
        chain_id: this.state.chain_id,
        chain_name,
        description,
        chain_date: this.state.chain_date,
        chain_price,
        chain_generation_id: this.props.navigation.getParam('generation_id'),
        subject_id: this.state.subject_id,
      };
      console.log(JSON.stringify(obj));
      RNFetchBlob.fetch(
        'POST',
        basic.url + 'admin/edit_chain.php',
        {
          Authorization: 'Bearer access-token',
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'image',
            filename: 'avatar.png',
            type: 'image/png',
            data: this.state.filePath['data'],
          },
          {
            name: 'chain_id',
            data: this.state.chain_id,
          },
          {
            name: 'chain_name',
            data: chain_name,
          },
          {
            name: 'description',
            data: description,
          },
          {
            name: 'chain_date',
            data: this.state.chain_date,
          },

          {
            name: 'preview_photo',
            data: this.state.filePath == null ? null : '1',
          },
          {
            name: 'chain_price',
            data: chain_price,
          },
          {
            name: 'chain_generation_id',
            data: this.props.navigation.getParam('generation_id'),
          },
          {
            name: 'subject_id',
            data: this.state.subject_id,
          },
        ],
      )
        .then((resp) => {
          let data = resp.data.trim();
          console.log(data);

          if (data == '"success"') {
            ToastAndroid.showWithGravityAndOffset(
              'تمت التعديل بنجاح',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            this.componentDidMount();
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        })
        .finally(() => {
          this.closeModal();
          allData[itemIndex].editLoading = false;
          this.setState({
            My_videos_array: allData,
          });
        });
    } else {
      this.setState({
        requestLoading: false,
      });
    }
  }

  async deleteVideo(index) {
    Alert.alert(
      'أدمن',
      'هل انت متأكد من حذف هذه السلسلة ؟',
      [
        {
          text: 'حذف',
          onPress: async () => {
            let allData = this.state.My_videos_array;
            allData[index].deleteLoading = true;
            this.setState({
              My_videos_array: allData,
            });

            let dataToSend = {
              chain_id: allData[index].chain_id,
              subject_id: this.state.subject_id,
            };
            axios
              .post(basic.url + 'admin/delete_chain.php', dataToSend)
              .then((res) => {
                console.log(res.data);
                if (res.data == 'success') {
                  allData.splice(index, 1);
                  ToastAndroid.showWithGravityAndOffset(
                    'قد تم حذف السلسلة',
                    ToastAndroid.BOTTOM,
                    ToastAndroid.SHORT,
                    25,
                    50,
                  );
                } else {
                  ToastAndroid.showWithGravityAndOffset(
                    'حدث خطأ ما الرجاء المحاولة فى وقت لاحق',
                    ToastAndroid.BOTTOM,
                    ToastAndroid.SHORT,
                    25,
                    50,
                  );
                }
              })
              .finally(() => {
                allData.map((item) => (item.deleteLoading = false));
                this.setState({
                  My_videos_array: allData,
                });
              });
          },
        },
        {
          text: 'إلغاء',
          style: 'cancel',
          onPress: () => {},
        },
      ],
      {
        cancelable: true,
      },
    );
  }

  async update_show_video(video_index) {
    let generation_id = this.props.navigation.getParam('generation_id');
    let collection_id = this.props.navigation.getParam('collection_id');
    let videos = this.state.My_videos_array;
    let value = videos[video_index].chain_show;
    let id = videos[video_index].chain_id;

    let loading = this.state.loading_lock;
    loading[video_index] = true;
    this.setState({loading_lock: loading});

    let data_to_send = {
      chain_id: id,
      generation_id: generation_id,
      collection_id: collection_id,
      value: value == '0' ? '1' : '0',
      subject_id: this.state.subject_id,
    };
    console.log(data_to_send);

    axios
      .post(basic.url + `admin/update_chain_show.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // alert(res.data);
          if (res.data == 'success') {
            videos[video_index].chain_show = value == 0 ? 1 : 0;
            this.setState({My_videos_array: videos});
            Alert.alert('أدمن', 'تمت العمليه بنجاح');
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        } else {
          Alert.alert('أدمن', 'حدث شئ خطأ');
        }
        loading[video_index] = false;
        this.setState({loading_lock: loading});
      });
  }

  getAllMyVediosFor = async () => {
    let generation_id = this.props.navigation.getParam('generation_id');
    let collection_id = this.props.navigation.getParam('collection_id');
    this.setState({
      isPageLoading: true,
    });
    // let data_to_send = {
    //   playlist_id: this.state.chainDetails.chain_id,
    //   student_id: StudentData.student_id,
    // };
    let data_to_send = {
      generation_id: generation_id,
      // collection_id: collection_id == -1 ? '0' : collection_id,
      subject_id: this.state.subject_id,
    };

    console.log(JSON.stringify(data_to_send));

    axios
      .post(basic.url + 'doctor/home/select_chain.php', data_to_send)
      .then((res) => {
        console.log(res.data);
        this.setState({
          isPageLoading: false,
        });
        if (Array.isArray(res.data) && res.data.length != 0) {
          let allData = res.data;
          allData.map((item) => (item.deleteLoading = false));
          allData.map((item) => (item.editLoading = false));

          this.setState({My_videos_array: allData, thereIsVideos: true});
        } else {
          this.setState({My_videos_array: []});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderMyVideoDetails = ({item, index}) => {
    // alert(JSON.stringify(item));
    return (
      <TouchableOpacity
        // disabled={true}
        onPress={() => {
          this.props.navigation.navigate('VideosList', {
            generation_id: this.props.navigation.getParam('generation_id'),
            collection_id: -1,
            subject_id: this.state.subject_id,
            chain_id: item.chain_id,
          });
        }}
        // onLongPress={() => {
        //   this.setState({
        //     visableActionSheet: true,
        //     selected_video: item,
        //     selected_video_index: index,
        //   });
        // }}
        style={{
          width: '90%',
          margin: '5%',
          flexDirection: 'row',
          backgroundColor: '#f7f4f4',
          shadowColor: '#ddd',
          shadowOffset: {width: 5, height: 5},
          shadowOpacity: 0.26,
          elevation: 8,
          borderRadius: 20,
        }}>
        <View style={{minHeight: 150, width: '40%'}}>
          <ImageBackground
            source={{uri: item.preview_photo}}
            imageStyle={{borderRadius: 20}}
            style={{
              flex: 1,
              width: null,
              height: null,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              disabled={true}
              onPress={() => {
                this.setState({vedio_details: item});
                if (item.can_see) {
                  this.setState({alertBeforeWatchingModal: true});
                } else {
                  this.setState({unableWatchModal: true});
                }
              }}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#385898',
                borderRadius: 50,
              }}>
              <FontAwesome5 name="play" color="#FFF" size={20} />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <View
          style={{
            margin: 10,
            width: '50%',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '100%'}}>
            <Text
              numberOfLines={2}
              style={{fontFamily: 'Janna LT Bold', fontSize: 20}}>
              {item.chain_name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Janna LT Bold',
                fontSize: 11,
                textAlign: 'left',
              }}>
              {item.chain_date}
            </Text>
          </View>
          <View style={{width: '100%'}}>
            <Text
              numberOfLines={2}
              style={{fontFamily: 'Janna LT Bold', fontSize: 16}}>
              {item.description}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              numberOfLines={1}
              style={{fontFamily: 'Janna LT Bold', fontSize: 16}}>
              {item.chain_price} LE
            </Text>
            {/* <View style={{flexDirection: 'row'}}>
              <Text
                numberOfLines={1}
                style={{fontFamily: 'Janna LT Bold', fontSize: 16}}>
                {item.view_count}
              </Text>
              <Icon
                name={'eye'}
                style={{
                  fontSize: 20,
                  color: '#385898',
                  // marginTop: 10,
                  marginRight: 30,
                  alignSelf: 'center',
                }}
              />
            </View> */}
          </View>
        
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header style={{backgroundColor: color}} androidStatusBarColor={color}>
          <Left style={{flex: 1}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                name="angle-right"
                style={{fontSize: 35, color: '#fff', marginLeft: 10}}
              />
            </TouchableOpacity>
          </Left>
          <Body style={{flex: 3, alignItems: 'center'}}>
            <Title>السلاسل</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isPageLoading}
              onRefresh={this.componentDidMount.bind(this)}
              colors={['#385898', '#385898']}
            />
          }>
          <View style={{flex: 1}}>
            {this.state.isPageLoading ? null : this.state.thereIsVideos ? (
              <>
                <FlatList
                  data={this.state.My_videos_array}
                  style={{paddingBottom: 70}}
                  keyExtractor={(item) => item.chain_id}
                  renderItem={this.renderMyVideoDetails}
                />
              </>
            ) : (
              <View
                style={{
                  height: height - height * 0.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '90%',
                  margin: '5%',
                }}>
                <Text style={{fontFamily: 'Janna LT Bold', fontSize: 20}}>
                  لا توجد فيديوهات حتى الأن
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        {/* {this.state.isPageLoading == false &&
        (this.state.thereIsVideos == true ||
          this.state.thereIsVideos == false) ? (
          <TouchableOpacity
            onPress={() => {
              this.setState({
                visableAddVideo: true,
              });
            }}
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              backgroundColor: color,
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 60 / 2,
            }}>
            <Ionicons name="add" color="#fff" size={28} />
          </TouchableOpacity>
        ) : null} */}

        {/*   --------------------------------------------   */}

        <Modal
          visible={this.state.visableAddVideo}
          transparent={true}
          onRequestClose={() => {
            this.setState({
              visableAddVideo: false,
            });
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.closeModal();
              }}
              style={{flex: 1, width: '100%', height: '100%'}}>
              <View style={{flex: 1, width: '100%', height: '100%'}}></View>
            </TouchableWithoutFeedback>
            <View
              style={{
                paddingVertical: 20,
                backgroundColor: '#fff',
                marginHorizontal: 20,
                borderRadius: 10,
                width: '90%',
              }}>
              <ScrollView>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      marginLeft: 20,
                      fontWeight: 'bold',
                    }}>
                    {this.state.addOreditVideo == 'add'
                      ? 'إضافة سلسلة فيديوهات'
                      : 'تعديل سلسلة الفيديوهات'}
                  </Text>

                  <TextInput
                    autoFocus={true}
                    theme={{
                      colors: {
                        primary: color,
                        underlineColor: 'transparent',
                      },
                    }}
                    value={this.state.chain_name}
                    label={'إسم السلسلة'}
                    autoCapitalize={'none'}
                    onChangeText={(text) => {
                      this.setState({
                        chain_name: text,
                      });
                    }}
                    autoCorrect={false}
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      margin: '5%',
                    }}
                  />

                  <TextInput
                    theme={{
                      colors: {
                        primary: color,
                        underlineColor: 'transparent',
                      },
                    }}
                    value={this.state.description}
                    label={'وصف السلسلة'}
                    multiline={true}
                    autoCapitalize={'none'}
                    onChangeText={(text) => {
                      this.setState({
                        description: text,
                      });
                    }}
                    autoCorrect={false}
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      margin: '5%',
                      maxHeight: 190,
                    }}
                  />

                  <TextInput
                    theme={{
                      colors: {
                        primary: color,
                        underlineColor: 'transparent',
                      },
                    }}
                    value={this.state.chain_price}
                    label={'ثمن السلسة'}
                    multiline={true}
                    autoCapitalize={'none'}
                    onChangeText={(text) => {
                      this.setState({
                        chain_price: text,
                      });
                    }}
                    autoCorrect={false}
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      margin: '5%',
                      maxHeight: 190,
                    }}
                  />
                  {/* <TextInput
                  theme={{
                    colors: {
                      primary: color,
                      underlineColor: 'transparent',
                    },
                  }}
                  value={this.state.viemo_id}
                  label={'Video Link ID'}
                  autoCapitalize={'none'}
                  onChangeText={(text) => {
                    this.setState({
                      viemo_id: text,
                    });
                  }}
                  autoCorrect={false}
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    margin: '5%',
                  }}
                /> */}

                  {this.state.filePath != null ? (
                    <>
                      <Image
                        source={{uri: this.state.filePath.uri}} //this.state.question_obj.question_image }}
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

                      <TouchableOpacity
                        // disabled={this.state.disabled}
                        onPress={() => {
                          this.setState({filePath: null});
                        }}
                        style={{
                          width: '50%',
                          backgroundColor: color,
                          justifyContent: 'center',
                          // marginTop: 5,
                          alignSelf: 'center',
                          flexDirection: 'row',
                          borderRadius: 3,
                          opacity: 0.9,
                          marginVertical: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: 23,
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            color: '#fff',
                          }}>
                          مسح الصورة
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : null}
                  <TouchableOpacity
                    disabled={this.state.isPageLoading}
                    onPress={() => {
                      this.chooseFile();
                    }}
                    style={{
                      width: '90%',
                      backgroundColor: color,
                      justifyContent: 'center',
                      marginTop: 5,
                      marginBottom: 10,
                      alignSelf: 'center',
                    }}>
                    {this.state.filePath != null ? (
                      <Text
                        style={{
                          fontSize: 24,
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          color: '#FFF',
                        }}>
                        تغيير صورة
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: 24,
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          color: '#FFF',
                        }}>
                        اختيار الصورة
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    disabled={this.state.requestLoading}
                    onPress={() => {
                      if (this.state.addOreditVideo == 'add') {
                        this.addVideo();
                      } else {
                        this.editVideo();
                      }
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: color,
                      width: '35%',
                      height: 50,
                      padding: 10,
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}>
                    {this.state.requestLoading ? (
                      <ActivityIndicator color="#fff" size={18} />
                    ) : (
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#fff',
                        }}>
                        {this.state.addOreditVideo == 'add' ? 'إضافة' : 'تعديل'}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={this.state.requestLoading}
                    onPress={() => {
                      this.closeModal();
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      width: '35%',
                      height: 50,

                      padding: 10,
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}>
                    <Text style={{fontSize: 18, color: '#fff'}}>إلغاء</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                this.closeModal();
              }}
              style={{flex: 1, width: '100%', height: '100%'}}>
              <View style={{flex: 1, width: '100%', height: '100%'}}></View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
        <Modal
          visible={this.state.visableActionSheet}
          onRequestClose={() => {
            this.setState({
              visableActionSheet: false,
            });
          }}
          transparent={true}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({visableActionSheet: false});
              }}
              style={{flex: 1, width: '100%', height: '100%'}}>
              <View style={{flex: 1, width: '100%', height: '100%'}}></View>
            </TouchableWithoutFeedback>

            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                backgroundColor: '#FFF',
                elevation: 10,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                padding: 30,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Switch
                  value={
                    this.state.selected_video.can_buy == '1' ? true : false
                  }
                  onValueChange={() => {
                    this.toggleVideoToBuy();
                  }}
                />
                <Text>
                  Enabled (
                  {this.state.selected_video.can_buy == '1' ? 'on' : 'off'})
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
