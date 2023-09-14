import * as React from 'react';
import {
  StatusBar,
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  Animated,
  Platform,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ToastAndroid,
  Alert,
  Modal,
  AsyncStorage,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NetInfo from '@react-native-community/netinfo';
import {Spinner, Toast, Root} from 'native-base';
import {TextInput} from 'react-native-paper';

import axios from 'axios';
const {width, height} = Dimensions.get('window');
import {images} from '../../constants';
import basic from './BasicURL';
import {color} from '../color';
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
class SelectSubject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollX: new Animated.Value(0),
      loading: true,
      connection_Status: true,
      Subjects: [],
      openLogoutModal: false,
      checkLogoutLoading: false,
      visableSubscribeModal: false,
      selectedItem: {},
      selectedItemIndex: 0,
      subCode: '',
      requestLoading: false,
    };
  }

  async componentDidMount() {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected == true) {
        this.setState({
          connection_Status: true,
        });
        this.selectDrs();
      } else {
        this.setState({
          connection_Status: false,
        });
      }
    });
  }

  /////////////////////////////////////////////////////////////    notifications

  /////////////////////////////////////////////////////////////////////////////////////////////
  async selectDrs() {
    const allData = JSON.parse(await AsyncStorage.getItem('AllData'));
    // console.log(allData);
    let data_to_send = {
      generation_id: allData.student_collection_id,
    };
    axios
      .post(basic.url + 'select_subject_forAdmin.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (Array.isArray(res.data.subject)) {
            if (res.data.subject.length == 0) {
              this.setState({
                Subjects: [],
              });
            } else {
              let mainData = res.data.subject;

              let newMainData = [{name: ''}, ...mainData, {name: ''}];
              this.setState({
                Subjects: newMainData,
              });
            }
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'الرجاء المحاولة فى وقت لاحق',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  renderSubjects = () => {
    const {scrollX} = this.state;
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          data={this.state.Subjects}
          // data={[]}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          bounces={false}
          decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
          contentContainerStyle={{alignItems: 'center'}}
          snapToInterval={ITEM_SIZE}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={images.NoInternet}
                  style={{
                    width: 200,
                    height: 200,
                    marginRight: width * 0.25,
                  }}
                  resizeMode="center"
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 22,
                    marginRight: width * 0.25,
                  }}>
                  لا توجد اى بيانات حتى الأن
                </Text>
              </View>
            );
          }}
          snapToAlignment="center"
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          scrollEventThrottle={16}
          renderItem={({item, index}) => {
            if (!item.subject_photo) {
              return <View style={{width: EMPTY_ITEM_SIZE}} />;
            }
            const inputRange = [
              (index - 1) * ITEM_SIZE,
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
            ];

            const translateY = this.state.scrollX.interpolate({
              inputRange: inputRange,

              outputRange: [50, 50, 50],

              extrapolate: 'clamp',
            });

            return (
              <View style={{width: width * 0.74}}>
                <Animated.View
                  style={{
                    marginHorizontal: 10,
                    padding: 10 * 2,
                    alignItems: 'center',
                    transform: [{translateY}],
                    backgroundColor: 'white',
                    borderRadius: 34,
                    elevation: 5,
                  }}>
                  <Image
                    // source={item.subject_image}
                    source={{uri: item.subject_photo}}
                    style={styles.posterImage}
                  />
                  <Text style={{fontSize: 20}} numberOfLines={1}>
                    {item.subject_name}
                  </Text>
                  {/* <Text
                    style={{fontSize: 20, fontFamily: FONTS.fontFamily}}
                    numberOfLines={1}>
                    _{item.about_subject}_
                  </Text> */}

                  <TouchableOpacity
                    onPress={async () => {
                      if (item.subscribed == '1') {
                        this.props.navigation.navigate('MainApp');

                        await AsyncStorage.setItem(
                          'drInfo',
                          JSON.stringify(item),
                        );
                      } else {
                        this.setState({
                          visableSubscribeModal: true,
                          selectedItem: item,
                          selectedItemIndex: index,
                        });
                      }
                    }}
                    style={{
                      width: '50%',
                      height: '10%',
                      borderRadius: 8,
                      padding: 8,
                      backgroundColor: color,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: '#fff'}}>دخول</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            );
          }}
        />
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={color} />
        <Root>
          {/* {this.Backdrop()} */}

          {/* <View style={{height: SIZES.height * 0.65}}></View> */}

          <LinearGradient
            // start={{x: 0.0, y: 0}}
            // end={{x: 0.1, y: 1.0}}
            // locations={[0, 0.5, 0.8]}
            useAngle={true}
            angle={180}
            angleCenter={{x: 0.5, y: 0.8}}
            colors={[color, color, color]}
            style={{
              height: '100%',
            }}>
            {this.state.loading && this.state.connection_Status ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator color="#000" size={30} />
              </View>
            ) : this.state.connection_Status == false ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <StatusBar backgroundColor={color} />
                <Text
                  style={{
                    fontSize: 22,
                  }}>
                  الرجاء التأكد من اتصالك بالأنترنت
                </Text>
              </View>
            ) : this.state.loading == false ? (
              this.renderSubjects()
            ) : null}
          </LinearGradient>
        </Root>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
  },
});

export default SelectSubject;
