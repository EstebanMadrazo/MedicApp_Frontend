import React, { useCallback, useEffect, useRef, useState} from 'react';
import { Avatar, GiftedChat, IMessage, InputToolbar, Send } from 'react-native-gifted-chat';
import { COLORS, icons, images } from '../constants';
//import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as io from 'socket.io-client'
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
//import 'react-native-get-random-values';
//import { v4 as uuidv4 } from 'uuid';
import * as Notifications from 'expo-notifications';

const Messaging = ({ route, navigation }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  //const { username, room, user_uuid } = useLocalSearchParams();
  const {appointmentInfo, userInfo} = route.params
  const room = appointmentInfo.appointment.uuid
  const username = userInfo.given_name + " " + userInfo.family_name
  const user_uuid = userInfo.uuid
  const [messageList, setMessageList] = useState<Array<any>>([]);
  const [socket, setSocket] = useState(io.connect(`${process.env.EXPO_PUBLIC_CHAT_SOCKET}`));
  const [text, setText] = useState<string>()
  var currentMessage = ""

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const joinRoom = async () => {
    await socket?.emit("join_room", room)
  }


  const getAllMessages = async() =>{
      try {
          const response = await axios(`${process.env.EXPO_PUBLIC_API_URL}/chat/getAllMessages`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              params:{
                uuid: room
              }
          })
          const reversedMessages = [...response.data].reverse();
          setMessageList(reversedMessages)
          //console.log("EN GET ALL MESSAGES--------------------------")
          //console.log(response.data)
      } catch (error:any) {
          console.log(error.response.data)
      }
  }

  const sendMessage = async () => {
    if(username) {
        const info = {
            sender: username,
            session_id:room,
            sent_at: new Date().setMinutes(new Date(). getMinutes() - new Date().getTimezoneOffset()),
            content: currentMessage,
            sender_uuid: user_uuid
        }

            /* sent_at: new Date(Date.now()).getHours() +
            ":" + 
            new Date(Date.now()).getMinutes(),
            content: currentMessage,
*/
        await socket?.emit("send_message" , info)
        //setMessageList((list) => [... list, info])
        //setCurrentMessage("")
        currentMessage = ""
    }
}

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    // Agregar los nuevos mensajes al estado actual
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    currentMessage = newMessages[newMessages.length - 1]?.text;
    console.log('Mensaje enviado:', currentMessage);
    sendMessage()
    
  }, [messages]);


  
  useEffect(() => {
  const giftedChatMessages = messageList.map((message) => {
    // Verificar si el sender del mensaje es el mismo que el username
    const isCurrentUser = message.sender === username;
    return {
      _id: Math.random().toString(36).substring(7), 
      text: message.content,
      createdAt: new Date(message.sent_at),
      user: {
        _id: isCurrentUser ? 1 : message.sender, // Si es el usuario actual, asignar _id como 1, de lo contrario usar el sender
        name: isCurrentUser ? "Yo" : message.sender, // Si es el usuario actual, asignar name como "Yo", de lo contrario usar el sender
      },
      Avatar: "default"
    };
  });
  setMessages(giftedChatMessages);
}, [messageList, username]);

  useEffect(() =>{
      if(socket){
          //console.log(socket)
          joinRoom()
          //console.log(room)
          getAllMessages()
      }
  },[socket] )

  useEffect(()=> {

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
      handleSuccess: () => {
        // dismiss notification immediately after it is presented
        Notifications.dismissAllNotificationsAsync();
      },
    });

    const messageHandle = (data: any) => {
      console.log("Entre a messageHandle")
      console.log(data)
      const message = {
        _id: Math.random().toString(36).substring(7), 
        text: data.content,
        createdAt: new Date(data.sent_at),
        user: {
          _id: data.sender, 
          name: data.sender
        },
        Avatar:"default"
      }
        setMessages((currentMessages) => GiftedChat.append(currentMessages, [message]));
    }
    socket.on("receive_message", messageHandle);

    /* return () => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    }; */
  }, [])

  return (
    <SafeAreaView style={[styles.container, {
      backgroundColor: COLORS.white
    }]}>
      <StatusBar hidden={true} />
      <View style={[styles.contentContainer, { backgroundColor: COLORS.white }]}>
        <View style={[styles.header, {
          backgroundColor: COLORS.white
        }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={icons.arrowLeft}
                resizeMode="contain"
                style={[styles.headerIcon, {
                  tintColor: COLORS.greyscale900
                }]}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, {
              color: COLORS.greyscale900
            }]}>{appointmentInfo.info.given_name}</Text>
          </View>
          {/* <View style={{ flexDirection: "row", alignItems: 'center' }}>
            <TouchableOpacity>
              <Image
                source={icons.call}
                resizeMode="contain"
                style={[styles.headerIcon, {
                  tintColor: COLORS.greyscale900
                }]}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 16 }}>
              <Image
                source={icons.moreCircle}
                resizeMode="contain"
                style={[styles.headerIcon, {
                  tintColor: COLORS.greyscale900
                }]}
              />
            </TouchableOpacity>
          </View> */}
        </View>
        <View style={[styles.chatContainer]}>
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{ _id: 1, name: "Yo"}}
            renderInputToolbar={props => (
              <View style={styles.inputToolbar}>
                <TextInput
                  style={styles.textInput}
                  value={text}
                  onChangeText={setText}
                  placeholder="Escribe un mensaje..."
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => {
                    if (text.trim()) {
                      onSend([{ _id: Math.random().toString(), text, createdAt: new Date(), user: { _id: 1, name: "Yo" } }]);
                      setText('');
                    }
                  }}
                >
                  <MaterialIcons name="send" size={24} color="black" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        {/* <View style={[styles.inputContainer, {
          backgroundColor: COLORS.white
        }]}>
          <View style={[styles.inputMessageContainer, {
            backgroundColor: COLORS.grayscale100,
          }]}>
            <TextInput
              style={[styles.input, {
                color: COLORS.blue2,
              }]}
              value={inputMessage}
              onChangeText={handleInputText}
              placeholderTextColor={COLORS.blue2}
              placeholder="Enter your message..."
            />
            <View style={styles.attachmentIconContainer}>
              <TouchableOpacity>
                <Feather name="image" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.microContainer}>
            <MaterialCommunityIcons name="microphone" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.greyscale300,
    //borderTopColor: '#333',
    //borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.black,
    marginLeft: 22
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 12,
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom:20
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  inputMessageContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    backgroundColor: COLORS.grayscale100,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  attachmentIconContainer: {
    marginRight: 12,
  },
  input: {
    color: COLORS.blue2,
    flex: 1,
    paddingHorizontal: 10,
  },
  microContainer: {
    height: 48,
    width: 48,
    borderRadius: 49,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  }
});


export default Messaging;

