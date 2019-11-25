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
    Alert
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';

import Firebase from 'firebase';
// var config = {
//     databaseURL: "https://fir-demo-9638c.firebaseio.com/",
//     projectId: "266257869696",
// };

var config = {
    databaseURL: "https://todolist-6174f.firebaseio.com/",
    projectId: "779627654948",
};
var indexKey


export default class AddTaskScreen extends Component {

    static navigationOptions = {
        headerStyle: {
            backgroundColor: 'black',
            borderBottomWidth: 0,
            height: (Dimensions.get('window').width) == 414 ? (60 * Dimensions.get('window').width / 375) : (45 * Dimensions.get('window').width / 375)

        },
        headerTitle: (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Add To Do</Text>
        ),
        headerTintColor: 'white', // YAY! Proper format!
        headerTitleStyle: { color: 'white' },

    };

    constructor(props) {
        super(props)


        if (!Firebase.apps.length) {
            Firebase.initializeApp(config);
        }

        const { param } = this.props.navigation.state.params;
        if (param.task_title) {
            this.state = {
                title: param.task_title,
                priority: param.priority,
                device_token: "",
                isedit: true,
                indexKey: ""
            }

            const rootRef = Firebase.database().ref();
            const fooRef = rootRef.child("Users/");
            fooRef.on("value", snap => {
                const foo = snap.val();
                if (foo !== null) {
                    Object.keys(foo).forEach(key => {
                        console.log(foo[key]);
                        let obj = foo[key]
                        if (obj.priority == this.state.priority && obj.task_title == this.state.title) {
                            indexKey = key
                        }
                    });

                }
            });

        }
        else {
            this.state = {
                title: "",
                priority: "Low",
                device_token: "",
                isedit: false
            }
        }

    }
    SaveData() {
        if (this.state.isedit) {
            if (this.state.title == "" || this.state.priority == "") {
                alert("Please fill details")
                return;
            }
            var adaNameRef = Firebase.database().ref('Users/' + indexKey);
            adaNameRef.update({ task_title: this.state.title, priority: this.state.priority });
            this.props.navigation.pop()
            alert("Task Updated!")


        }
        else {
            if (this.state.title == "" || this.state.priority == "") {
                alert("Please fill details")
                return;
            }
            Firebase.database().ref('Users/').push({
                task_title: this.state.title,
                priority: this.state.priority,
            }).then((data) => {
                //success callback
                Alert.alert("Task Saved!")
                this.props.navigation.pop()
            }).catch((error) => {
                //error callback
                console.log('error ', error)
            })
        }
    }
    DeleteTask() {
        Firebase.database().ref('Users/' + indexKey).remove();
        this.props.navigation.pop()
        alert("Task Deleted!")
    }
    render() {
        let data = [{
            value: 'Low',
        }, {
            value: 'Medium',
        }, {
            value: 'High',
        }];
        return (
            <View>
                <SafeAreaView>
                    <View style={styles.container}>
                        <View height={40} />
                        <Text style={{ color: "white" }}>To do title</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Priority"
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            returnKeyType="done"
                            autoCapitalize="none"
                            onChangeText={(text) => this.setState({ title: text })}
                            value={this.state.title}
                        />
                        <View height={0.5} backgroundColor="white" />
                        <View height={10} />
                        <Text style={{ color: "white" }}>Priority</Text>
                        <Dropdown
                            data={data}
                            placeholder='Select Priority *'
                            value={this.state.priority}
                            style={{ color: 'white' }}
                            baseColor="rgba(255, 255, 255, 1)"
                            onChangeText={(value) => { { this.setState({ priority: value }) } }}
                        />
                        <View height={50} />
                        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.SaveData()}>
                            {this.state.isedit ? <Text style={styles.bottomText}>EDIT TASK</Text> : <Text style={styles.bottomText}>SAVE TASK</Text>}
                        </TouchableOpacity>
                        <View height={50} />
                        {this.state.isedit ? <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.DeleteTask()}>
                            <Text style={styles.bottomText}>DELETE TASK</Text>
                        </TouchableOpacity> : console.log("")}
                        <View height={20} />
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
        paddingStart: "10%",
        paddingEnd: "10%",
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
    buttonStyle: {
        justifyContent: "center",
        flexDirection: "row",
        alignSelf: "center"
    }
});
