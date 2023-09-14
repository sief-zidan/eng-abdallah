import React, {Component} from 'react';

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

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const {width, height} = Dimensions.get('window');
import {color} from '../color';

// var DESTRUCTIVE_INDEX = 1;
// var CANCEL_INDEX = 6;

export default class Generations extends Component {
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
      item: '',
      changeButton: true,
    };
    this._refreshPages = this._refreshPages.bind(this);
  }
  componentDidMount() {
    this.getgenedata();
  }

  _refreshPages() {
    axios.get(basic.url + 'select_generations.php').then((res) => {
      this.setState({disabled: false});
      this.setState({data: res.data.gens});
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
      this.setState({AllStudents: Number, AllStudentsPending: NumberPending});
    });
  }

  getgenedata() {
    this.setState({disabled: true});
    axios.get(basic.url + 'select_generations.php').then((res) => {
      // alert(JSON.stringify(res.data))
      this.setState({disabled: false});
      this.setState({data: res.data.gens});
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
      this.setState({AllStudents: Number, AllStudentsPending: NumberPending});
    });
  }

  renderClasses(item) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('MainChallenges', {
              AllData: item,
            });
          }}
          key={item.generation_id}>
          <View style={styles.order}>
            <View style={{justifyContent: 'center'}}>
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
                {item.generation_name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <Root>
        <Container>
          <Header
            style={{backgroundColor: color}}
            androidStatusBarColor={color}>
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
              <Title>الدفعات</Title>
            </Body>
            <Right style={{flex: 1}} />
          </Header>

          <ScrollView style={{marginBottom: 20, marginTop: 20}}>
            {this.state.disabled == false ? (
              <FlatList
                keyExtractor={(_, index) => index.toString()}
                data={this.state.data}
                numColumns={1}
                renderItem={({item}) => this.renderClasses(item)}
              />
            ) : (
              <Spinner color={color} style={{marginTop: 100}} />
            )}
          </ScrollView>
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
