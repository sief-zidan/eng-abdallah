import React, { Component } from 'react';

import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Alert,
    LayoutAnimation,
    Animated,
    Image,
    TextInput,
    FlatList,
    TouchableHighlight,
    Dimensions,
    TouchableWithoutFeedback,
    Picker,
    ActivityIndicator,
} from 'react-native';
import {
    Container,
    Header,
    Left,
    Right,
    Body,
    Title,
    // Icon,
    Item,
    Toast,
    Root,
    Spinner,
    ActionSheet,
    Button,
    Fab,
} from 'native-base';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ModalHome from 'react-native-modalbox';
import basic from './BasicURL';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const { width, height } = Dimensions.get('window');
import { color } from '../color';

// var DESTRUCTIVE_INDEX = 1;
// var CANCEL_INDEX = 6;

export default class Subject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: '',
            NameOfClass: '',
            id: '',
            data: [],
            modalVisable: false,
            modalVisible2: false,
            disabled: false,
            menuHeight: 0,
            AllStudents: '',
            AllStudentsPending: '',
            refresh: true,
            item: {},
            changeButton: true,
            visableAllSubjects: false,
            getSubjsLoading: true,
            subId: '',
            subData: [],
            navReson: '',
            image: null,
            filePath: {},
            change_photo: false,
            generation_id: this.props.navigation.getParam('generation_id'),
            subject_id: ''
        };
        this._refreshPages = this._refreshPages.bind(this);
    }
    componentDidMount() {
        this.getSubjects();
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
                let obj = this.state.image;
                obj = source.uri;

                this.setState({
                    filePath: source,
                    image: obj,
                    change_photo: true,
                });
            }
        });
    };



    getSubjects() {
        let data_to_send = {
            generation_id: this.props.navigation.getParam('generation_id'),
        };
        axios
            .post(basic.url + 'select_subject_forAdmin.php', data_to_send)
            .then((res) => {
                // console.log(data_to_send)
                if (res.status == 200) {
                    if (Array.isArray(res.data.subject)) {
                        if (res.data.subject.length == 0) {
                            this.setState({
                                subData: [],
                                subId: '',
                            });
                        } else {
                            this.setState({
                                data: res.data.subject,
                                subId: res.data.subject[0].subject_id,
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
                    getSubjsLoading: false,
                });
            });
    }
    _refreshPages() {
        axios.get(basic.url + 'select_generations.php').then((res) => {
            this.setState({ disabled: false });
            this.setState({ data: res.data.gens });
            let array = res.data.gens;
            let Number = 0;
            let NumberPending = 0;
            for (let i = 0; i < array.length; i++) {
                Number =
                    Number +
                    (parseInt(array[i].student_with_pending) +
                        parseInt(array[i].student_without_pending));
                NumberPending = NumberPending + parseInt(array[i].student_with_pending);
            }
            this.setState({ AllStudents: Number, AllStudentsPending: NumberPending });
        });
    }

    // _getAllStudents(){
    //   let array=this.state.data
    //   let Number=0;
    //   for(let i=0;i<array.length;i++){
    //      Number= parseInt(array[i].student_with_pending)+parseInt(array[i].student_without_pending)
    //   }
    //  this.setState({AllStudents:Number})
    //     // return Number;
    // }
    getgenedata() {
        this.setState({ disabled: true });
        axios.get(basic.url + 'select_generations.php').then((res) => {
            // alert(JSON.stringify(res.data))
            this.setState({ disabled: false });
            this.setState({ data: res.data.gens });
            let array = res.data.gens;
            let Number = 0;
            let NumberPending = 0;
            for (let i = 0; i < array.length; i++) {
                Number =
                    Number +
                    (parseInt(array[i].student_with_pending) +
                        parseInt(array[i].student_without_pending));
                NumberPending = NumberPending + parseInt(array[i].student_with_pending);
            }
            this.setState({ AllStudents: Number, AllStudentsPending: NumberPending });
        });
    }
    openMenu = () => {
        LayoutAnimation.spring();
        if (this.state.menuHeight == 0) {
            this.setState({ menuHeight: 500 });
        }
    };

    closeMenu = () => {
        LayoutAnimation.spring();
        if (this.state.menuHeight != 0) {
            this.setState({ menuHeight: 0 });
        }
    };

    _deleteClass(item) {
        let data_to_send = {
            subject_id: item.subject_id,
        };
        this.setState({ disabled: true });
        axios
            .post(
                basic.url + `admin/delete_subject.php`,

                data_to_send,
            )
            .then((res) => {
                if (res.data != 'error') {
                    this.setState({ disabled: false });

                    const OriginalArray = this.state.data;

                    OriginalArray.splice(this.state.data.indexOf(item), 1);

                    this.setState({
                        data: OriginalArray,
                    });
                    Toast.show({
                        text: 'تم مسح المادة بنجاح',
                        buttonText: 'شكرا',
                        textStyle: { color: '#FFF' },
                        buttonTextStyle: { color: '#FFF' },
                        type: 'danger',
                        duration: 7000,
                    });
                    this.setState({ modalVisible2: false });
                } else {
                    //   Alert.alert(')
                    this.setState({ disabled: false, modalVisible2: false });
                }
            });
    }
    renderClasses(item) {
        return (
            <View>
                <TouchableOpacity
                    // onPress={() => {
                    //   this.props.navigation.navigate('GroupPage', {
                    //     generation_id: item.generation_id,
                    //     AllData: item.cols,
                    //     _refreshPages: this._refreshPages.bind(this),
                    //     testPage: '0',
                    //   });
                    // }}
                    onPress={
                        () => this.setState({ modalVisible2: true, item: item })
                        // ActionSheet.show(
                        //              
















                    }
                    key={item.generation_id}>
                    <View style={styles.order}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text
                                // numberOfLines={1}
                                // ellipsizeMode="tail"
                                style={{
                                    marginLeft: 10,
                                    fontSize: 18,
                                    // color: '#000',
                                    // textAlign: 'right',
                                    // top: 5,
                                    fontWeight: 'bold',
                                }}>
                                {item.subject_name}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    add_Class() {
        if (this.state.NameOfClass.trim() != '') {

            let data_to_send = [
                // element with property `filename` will be transformed into `file` in form data
                {
                    name: 'image',
                    filename: 'avatar.png',
                    type: 'image/png',
                    data: this.state.filePath['data'],
                },
                {
                    name: 'subject_name',
                    data: this.state.NameOfClass,
                },
                {
                    name: 'change_photo',
                    data: this.state.change_photo == false ? '0' : '1',
                },
                {
                    name: 'genration_take',
                    data: this.state.generation_id,
                }
            ]
            // console.log(data_to_send)
            RNFetchBlob.fetch(
                'POST',
                basic.url + `admin/add_subject.php`,
                {
                    Authorization: 'Bearer access-token',
                    otherHeader: 'foo',
                    'Content-Type': 'multipart/form-data',
                },
                data_to_send
                ,
            )
                .then((resp) => {
                    console.log(resp.data);
                    this.setState({ loading: false });

                    let data = resp.data.trim();
                    if (data == '"success"') {
                        this.setState({ isChange: true, modalVisable: false });
                        this.getSubjects()
                        Alert.alert('أدمن', 'تم اضافة المادة بنجاح');
                    } else {
                        Alert.alert('أدمن', 'حدث خطأ ما من فضلك حاول مره اخرى');
                    }
                })
                .catch((err) => {
                    // ...
                });















        } else {
            Alert.alert('أدمن', 'يجب إدخال إسم الدفعه');
        }

        // } else {
        //   Alert.alert('PROMO WEDDING', "Type all fields please, it's required")
        // }
    }
    Update_Name_Of_Class() {
        let data_to_send = [
            // element with property `filename` will be transformed into `file` in form data
            {
                name: 'image',
                filename: 'avatar.png',
                type: 'image/png',
                data: this.state.filePath['data'],
            },
            {
                name: 'subject_name',
                data: this.state.NameOfClass,
            },
            {
                name: 'change_photo',
                data: this.state.change_photo == false ? '0' : '1',
            },
            {
                name: 'subject_id',
                data: this.state.subject_id,
            }
        ]
        console.log(data_to_send)
        RNFetchBlob.fetch(
            'POST',
            basic.url + `admin/update_subject.php`,
            {
                Authorization: 'Bearer access-token',
                otherHeader: 'foo',
                'Content-Type': 'multipart/form-data',
            },
            data_to_send
            ,
        )
            .then((resp) => {
                console.log(resp.data);
                this.setState({ loading: false });

                let data = resp.data.trim();
                if (data == '"success"') {
                    this.setState({ isChange: true, modalVisable: false });
                    this.getSubjects()
                    Alert.alert('أدمن', 'تم تعديل المادة بنجاح');
                } else {
                    Alert.alert('أدمن', 'حدث خطأ ما من فضلك حاول مره اخرى');
                }
            })
            .catch((err) => {
                // ...
            });
    }
    render() {
        return (
            <Root>
                <Container>
                    <Header
                        style={{ backgroundColor: color }}
                        androidStatusBarColor={color}>
                        <Left style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon
                                    name="angle-right"
                                    size={35}
                                    style={{ paddingRight: 10, paddingLeft: 10, color: '#FFF' }}
                                />
                            </TouchableOpacity>
                        </Left>
                        {/* <Left style={{flex: 1}}>
              <TouchableOpacity onPress={this.openMenu}>
                <Icon
                  name="md-menu"
                  size={22}
                  style={{
                    paddingRight: 10,
                    paddingLeft: 10,
                    marginTop: 10,
                    color: '#FFF',
                  }}
                />
              </TouchableOpacity>
            </Left> */}
                        <Body style={{ flex: 3, alignItems: 'center' }}>
                            <Title>المواد</Title>
                        </Body>
                        <Right style={{ flex: 1 }} />
                    </Header>
                    <Modal
                        animationType="slide"
                        // transparent={true}
                        visible={this.state.modalVisable}
                        onRequestClose={() => {
                            this.setState({ modalVisable: false });
                        }}>
                        <View
                            style={{
                                marginBottom: 20,
                                marginTop: 40,
                            }}>
                            {this.state.changeButton == false ? (
                                <Text
                                    style={{
                                        margin: 24,
                                        marginBottom: 10,
                                        marginTop: 10,
                                        fontSize: 22,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}>
                                    تعديل اسم المادة
                                </Text>
                            ) : (
                                <Text
                                    style={{
                                        margin: 24,
                                        marginBottom: 10,
                                        marginTop: 10,
                                        fontSize: 22,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}>
                                    اضافة مادة
                                </Text>
                            )}
                        </View>
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
                                placeholder="اسم المادة"
                                placeholderTextColor="#000"
                                onChangeText={(NameOfClass) => this.setState({ NameOfClass })}
                                value={this.state.NameOfClass}
                            />
                        </View>

                        {this.state.image != null ? (
                            <>
                                <Image
                                    source={{ uri: this.state.image }} //this.state.question_obj.question_image }}
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
                                        let Photo = this.state.image;

                                        Photo = null;
                                        this.setState({ image: Photo });
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


                        <Button
                            disabled={this.state.disabled}
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
                            {this.state.image != null ? (
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
                        </Button>
                        <Button
                            disabled={this.state.disabled}
                            onPress={() => {
                                if (this.state.changeButton == false) {
                                    this.Update_Name_Of_Class();
                                } else {
                                    this.add_Class();
                                }
                            }}
                            style={{
                                width: '90%',
                                backgroundColor: color,
                                justifyContent: 'center',
                                marginTop: 20,
                                alignSelf: 'center',
                            }}>
                            {this.state.disabled == true ? (
                                <Spinner color="white" size={25} style={{ marginTop: 5 }} />
                            ) : this.state.changeButton == false ? (
                                <Text
                                    style={{
                                        fontSize: 24,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        color: '#FFF',
                                    }}>
                                    تعديل
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
                                    اضافة
                                </Text>
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
                            disabled={this.state.disabled}
                            onPress={() => {
                                this.setState({ modalVisable: false });
                            }}>
                            <Text
                                style={{
                                    //   color: 'white',
                                    marginTop: 5,
                                    fontSize: 20,
                                    textAlign: 'center',
                                }}>
                                الغاء
                            </Text>
                        </TouchableOpacity>
                    </Modal>
                    <ScrollView style={{ marginBottom: 20, marginTop: 20 }}>
                        {this.state.disabled == false ? (
                            <FlatList
                                data={this.state.data}
                                numColumns={1}
                                renderItem={({ item }) => this.renderClasses(item)}
                            />
                        ) : (
                            <Spinner color={color} style={{ marginTop: 100 }} />
                        )}
                    </ScrollView>
                    {!this.state.modalVisible2 ? (
                        <Fab
                            direction="up"
                            // containerStyle={{}}

                            style={{ backgroundColor: color, marginRight: 10 }}
                            position="bottomRight"
                            onPress={() =>
                                this.setState({
                                    modalVisable: true,
                                    NameOfClass: '',
                                    changeButton: true,
                                    image: null,
                                    change_photo: false

                                })
                            }>
                            <Icon name="plus" style={{ fontSize: 30 }} color="#FFF" />
                        </Fab>
                    ) : null}

                    <ModalHome
                        onRequestClose={() => {
                            this.setState({
                                modalVisible2: false,
                            });
                        }}
                        style={{
                            height: height / 3.9,
                            // maxHeight: height / 1.2,
                            // borderTopRightRadius: 15,
                            // borderTopLeftRadius: 15,
                            backgroundColor: '#fff',
                            // zIndex: 1235200000000566788899,
                        }}
                        backButtonClose={true}
                        backdropPressToClose={true}
                        isOpen={this.state.modalVisible2}
                        backdrop={true}
                        // entry='bottom'
                        onClosed={() => {
                            this.setState({
                                modalVisible2: false,
                            });
                        }}
                        swipeArea={50}
                        // swipeThreshold={50}
                        position="bottom"
                        useNativeDriver={true}>
                        <ScrollView>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', marginBottom: 20, marginTop: 10 }}
                                onPress={() => {

                                    console.log(this.state.item)

                                    this.setState({
                                        // NameOfClass: this.state.item.subject_name,
                                        modalVisable: true,
                                        NameOfClass: this.state.item.subject_name,
                                        generation_id: this.state.item.genration_take,
                                        modalVisible2: false,
                                        changeButton: false,
                                        image: this.state.item.subject_photo,
                                        subject_id: this.state.item.subject_id
                                    });
                                }}>
                                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                                    <Icon name="user-edit" size={25} style={{ color: '#2c8ef4' }} />
                                </View>
                                <Text style={{ fontSize: 18 }}>تعديل</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                style={{ flexDirection: 'row', marginBottom: 20 }}
                                onPress={() => {
                                    Alert.alert(
                                        'أدمن',
                                        ' هل انت متأكد من مسح الدفعه',
                                        [
                                            {
                                                text: 'نعم',
                                                onPress: () => this._deleteClass(this.state.item),
                                            },

                                            {
                                                text: 'لا',
                                                onPress: () => this.setState({ modalVisible2: false }),
                                            },
                                        ],
                                        { cancelable: false },
                                    );
                                }}>
                                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                                    <Icon
                                        name="trash"
                                        size={25}
                                        style={{ color: '#fa213b', marginLeft: 10 }}
                                    />
                                </View>
                                <Text style={{ fontSize: 18 }}>مسح</Text>
                            </TouchableOpacity>




                            <TouchableOpacity
                                style={{ flexDirection: 'row', marginBottom: height / 7 }}
                                onPress={() => {
                                    this.setState({

                                        NameOfClass: '',
                                        generation_id: '',
                                        modalVisible2: false,
                                        changeButton: false,
                                        image: null,

                                        change_photo: false,
                                        modalVisible2: false
                                    });
                                }}>
                                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                                    <Icon
                                        name="times"
                                        size={25}
                                        style={{ color: '#ea943b', marginLeft: 10 }}
                                    />
                                </View>
                                <Text style={{ fontSize: 18 }}> الغاء</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </ModalHome>
                </Container>
            </Root>
        );
    }
}
const styles = StyleSheet.create({
    order: {
        marginTop: 0,
        marginBottom: 10,

        width: '97%',
        marginLeft: 5,
        backgroundColor: 'rgba(255,255,255,.7)',
        padding: 20,
        // height: 150,
        borderRadius: 10,
        borderColor: '#bcbaba',
        borderWidth: 1,
    },
    menu: {
        width: '80%',

        position: 'absolute',
    },
    contentBig: {
        backgroundColor: color,
        borderBottomRightRadius: 100,
    },
    menuLink: {
        height: 60,
        // justifyContent: 'center',
        flexDirection: 'row',
    },
    link_text: {
        color: '#FFF',
        marginTop: 17,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,

        // textAlign: 'center',
    },
    closeBttn: {
        backgroundColor: color,
        width: 40,
        height: 40,
        borderRadius: 20,

        justifyContent: 'center',

        alignSelf: 'center',
        marginTop: 20,
    },

    xBttn: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
    },
    bttnpairent: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
