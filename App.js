import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  // AsyncStorage,
  ActivityIndicator,
} from 'react-native';

import ClassPage from './Component/AdminPages/ClassPage';
import GroupPage from './Component/AdminPages/GroupPage';
import ListOfExams from './Component/AdminPages/ListOfExams';
import ListOfQuiz from './Component/AdminPages/ListOfQuiz';
import ExamReport from './Component/AdminPages/ExamReport';
import SolvedStudents from './Component/AdminPages/SolvedStudents';
import NotSolvedStudents from './Component/AdminPages/NotSolvedStudents';
import ExamQuestions from './Component/AdminPages/ExamQuestions';
import AddEditQuestion from './Component/AdminPages/AddEditQuestion';
import AddExam from './Component/AdminPages/AddExams';
import AddSummery from './Component/AdminPages/AddSummery';
import SummaryList from './Component/AdminPages/SummeryList';
import Viewer from './Component/AdminPages/Viewer';
import explain from './Component/AdminPages/explain';
import Subject from './Component/AdminPages/subject';

import Links from './Component/AdminPages/links';
import Addlinks from './Component/AdminPages/Addlinks';


//
import Generations from './Component/AdminPages/Generations';
import MainChallenges from './Component/AdminPages/MainChallenges';
import chaptersPage from './Component/AdminPages/chaptersPage';
import FinishChallenge from './Component/AdminPages/FinishChallenge';
import FinishDetails from './Component/AdminPages/FinishDetails';
import QuestionDetails from './Component/AdminPages/QuestionDetails';
import TopRatedStudent from './Component/AdminPages/TopRatedStudent';
import ChapterQuestions from './Component/AdminPages/ChapterQuestions';
import AddEditQuestionToChapter from './Component/AdminPages/AddEditQuestionToChapter';
//
import PendingStudents from './Component/AdminPages/PendingStudents';
import HomePage from './Component/AdminPages/HomePage';
import SeeMore from './Component/AdminPages/SeeMore';
import Seloved_Student_Exam from './Component/AdminPages/Seloved_Student_Exam';
import VideosList from './Component/AdminPages/VideosList';
import SelectSubject from './Component/AdminPages/SelectSubject';
// import SwitchControle from './Component/AdminPages/SwitchControle';
import UpdateProfile from './Component/AdminPages/UpdateProfile';
import Students from './Component/AdminPages/Students';
import {createStackNavigator} from 'react-navigation-stack';

// import {View, Text, Image, StyleSheet, Button} from 'react-native';
// import {} from 'native-base'
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
// import {createDrawerNavigator} from 'react-navigation-drawer';
import ChainVideosList from './Component/AdminPages/ChainVideosList';

class App extends React.Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
}

const HomePages = createStackNavigator(
  {
    HomePage: {
      screen: HomePage,
    },
    ClassPage: {
      screen: ClassPage,
    },
    GroupPage: {
      screen: GroupPage,
    },
    ListOfExams: {
      screen: ListOfExams,
    },
    ListOfQuiz: {
      screen: ListOfQuiz,
    },
    PendingStudents: {
      screen: PendingStudents,
    },
    Students: {
      screen: Students,
    },
    UpdateProfile: {
      screen: UpdateProfile,
    },
    SeeMore: {
      screen: SeeMore,
    },
    ExamReport: {
      screen: ExamReport,
    },
    SolvedStudents: {
      screen: SolvedStudents,
    },
    NotSolvedStudents: {
      screen: NotSolvedStudents,
    },

    AddEditQuestion: {
      screen: AddEditQuestion,
    },
    AddExam: {
      screen: AddExam,
    },
    ExamQuestions: {
      screen: ExamQuestions,
    },
    AddSummery: {
      screen: AddSummery,
    },
    SummaryList: {
      screen: SummaryList,
    },
    explain: {
      screen: explain,
    },
    Viewer: {
      screen: Viewer,
    },
    Seloved_Student_Exam: {
      screen: Seloved_Student_Exam,
    },
    //
    Generations: {
      screen: Generations,
    },
    MainChallenges: {
      screen: MainChallenges,
    },
    chaptersPage: {
      screen: chaptersPage,
    },
    FinishChallenge: {
      screen: FinishChallenge,
    },
    FinishDetails: {
      screen: FinishDetails,
    },
    QuestionDetails: {
      screen: QuestionDetails,
    },
    TopRatedStudent: {
      screen: TopRatedStudent,
    },
    ChapterQuestions: {
      screen: ChapterQuestions,
    },
    AddEditQuestionToChapter: {
      screen: AddEditQuestionToChapter,
    },
    VideosList: {
      screen: VideosList,
    },
    SelectSubject: {
      screen: SelectSubject,
    },
    ChainVideosList: {
      screen: ChainVideosList,
    }, Subject: {
      screen: Subject,
    }, Links: {
      screen: Links,
    }, Addlinks: {
      screen: Addlinks,
    },
  },
  {headerMode: 'none'},
);

export default createAppContainer(
  createSwitchNavigator(
    {
      // App: SummaryList,
      App: HomePage,

      HomePages: HomePages,
    },
    {
      initialRouteName: 'App',
    },
  ),
);
