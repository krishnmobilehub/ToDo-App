import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    TouchableHighlight
} from 'react-native';
import Firebase from 'firebase';
var config = {
    databaseURL: "https://todolist-6174f.firebaseio.com/",
    projectId: "779627654948",
};
var _this;
export default class ListTaskScreen extends Component {
    static navigationOptions = {
        headerStyle: {
            backgroundColor: 'black',
            borderBottomWidth: 0,
            height: (Dimensions.get('window').width) == 414 ? (60 * Dimensions.get('window').width / 375) : (45 * Dimensions.get('window').width / 375)
        },
        headerTitle: (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>To do list</Text>
        ),
        headerTintColor: 'white', // YAY! Proper format!
        headerTitleStyle: { color: 'white' },
    };
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            device_token: "",
            arr: [],

        }
        // initializeApp  Firebase
        if (!Firebase.apps.length) {
            Firebase.initializeApp(config);
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.load()
        }, 500);
    }
    //Load Firebase data
    load() {
        _this = this
        Firebase.database().ref('Users/').on('value', function (snapshot) {
            let data = snapshot.val();
            if (!data) {
                _this.setState({
                    arr: []
                })
                return
            }
            let items = Object.values(data);
            if (items.length > 0) {
                _this.setState({
                    arr: items
                })
            }
            else {
                _this.setState({
                    arr: []
                })
            }
        });
    }
    _onPress(item) {
        this.props.navigation.push("AddTaskScreen", { param: item, ListTaskScreen: this })
    }
    render() {
        return (
            <View>
                <SafeAreaView>
                    <View style={styles.container}>
                        <FlatList
                            data={this.state.arr}
                            renderItem={({ item, index, separators }) => (
                                <TouchableHighlight
                                    onPress={() => this._onPress(item)}
                                    onShowUnderlay={separators.highlight}
                                    onHideUnderlay={separators.unhighlight}>
                                    <View margin={5} justifyContent="center" style={{ backgroundColor: item.priority == "Low" ? "yellow" : item.priority == "Medium" ? "green" : 'red' }}>
                                        <Text style={styles.Textstyle}>{item.task_title}</Text>
                                        <Text style={styles.Textstyle}>{"Priority :" + item.priority}</Text>
                                    </View>
                                </TouchableHighlight>
                            )}
                        />
                        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.props.navigation.push("AddTaskScreen", { param: "", ListTaskScreen: this })}>
                            <Text style={styles.bottomText}>ADD TASK</Text>
                        </TouchableOpacity>
                        <View height={50} />
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        paddingStart: "5%",
        paddingEnd: "5%",
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: "black"
    },
    appLogo: {
        height: 200,
        width: 180,
        resizeMode: "cover",
        alignSelf: "center"
    },
    appBg: {
        height: "100%",
        width: "100%",
        resizeMode: "cover",
        position: "absolute"
    },
    textInput: {
        height: 40,
        borderRadius: 2,
        color: 'white',
        justifyContent: 'center'
    },
    bottomText: {
        color: "white",
        alignSelf: "center",
        padding: 5,
        fontSize: 16,
        fontWeight: "bold"
    },
    Textstyle: {
        color: "black",
        padding: 5,
        fontSize: 16,
        fontWeight: "bold"
    },
});
