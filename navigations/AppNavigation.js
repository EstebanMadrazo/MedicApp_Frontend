import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { AddNewAddress, 
  AddNewCard, 
  Address, 
  ArticlesDetails, 
  ArticlesSeeAll, 
  BookAppointment, 
  CancelAppointment, 
  CancelAppointmentPaymentMethods, 
  Categories, ChangeEmail, ChangePIN, 
  ChangePassword, Chat, CreateNewPIN, 
  CreateNewPassword, CustomerService, 
  DoctorDetails, DoctorReviews, EReceipt, 
  EditProfile, EnterYourPIN, Favourite, 
  FillYourProfile, Fingerprint, ForgotPasswordEmail, 
  ForgotPasswordMethods, ForgotPasswordPhoneNumber, 
  HelpCenter, InviteFriends, LeaveReview, Login, Messaging, 
  MyAppointmentMessaging, MyAppointmentVideoCall, MyAppointmentVoiceCall, 
  MyBookmarkedArticles, Notifications, OTPVerification, Onboarding1, Onboarding2, 
  Onboarding3, Onboarding4, PatientDetails, PaymentMethods, RescheduleAppointment, 
  ReviewSummary, Search, SelectPackage, SelectRescheduleAppointmentDate, SessionEnded, 
  SettingsLanguage, SettingsNotifications, SettingsPayment, SettingsPrivacyPolicy, SettingsSecurity, 
  Signup, TopDoctors, TrendingArticles, VideoCall, VideoCallHistoryDetails, VideoCallHistoryDetailsPlayRecordings, 
  VoiceCall, VoiceCallHistoryDetails, VoiceCallHistoryDetailsPlayRecordings, Welcome, TermsAndConditions,
  ScheduleRegister,EditCard, PatientQ } from '../screens';

import BottomTabNavigation from './BottomTabNavigation';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState(null)


  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('alreadyLaunched')
        
        console.log('Launch value: ',value)
        if (value === null) {
          await AsyncStorage.setItem('alreadyLaunched', 'true')
          setIsFirstLaunch(true)
        } else {
          setIsFirstLaunch(false)
        }
        await checkIfLogin()
      } catch (error) {
        console.log(error)
        setIsFirstLaunch(false)
      }
      setIsLoading(false) // Set loading state to false once the check is complete
    }

    const checkIfLogin = async() => {
      try{
        const info = await AsyncStorage.getItem('userInfo')
        console.log('INFO ', info)
        if(info !== null){
          setUserInfo(info)
        }
      }catch(error){
        console.log(error)
      }
    }

    checkIfFirstLaunch()
  }, [])

  if (isLoading) {
    return null // Render a loader or any other loading state component
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        // replace the second onboaring1 with login in order to make the user not to see the onboarding 
        // when login the next time
        initialRouteName={isFirstLaunch ? 'Onboarding1' : userInfo ? 'Main' : 'Login'}>
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        <Stack.Screen name="Onboarding3" component={Onboarding3} />
        <Stack.Screen name="Onboarding4" component={Onboarding4} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
        <Stack.Screen name="TaC" component={TermsAndConditions}/> 
        <Stack.Screen name="ScheduleRegister" component={ScheduleRegister}/> 
        <Stack.Screen name="ForgotPasswordMethods" component={ForgotPasswordMethods} />
        <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmail} />
        <Stack.Screen name="ForgotPasswordPhoneNumber" component={ForgotPasswordPhoneNumber} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
        <Stack.Screen name="FillYourProfile" component={FillYourProfile} />
        <Stack.Screen name="CreateNewPIN" component={CreateNewPIN} />
        <Stack.Screen name="Fingerprint" component={Fingerprint} />
        <Stack.Screen name="Main" component={BottomTabNavigation} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="SettingsNotifications" component={SettingsNotifications} />
        <Stack.Screen name='SettingsPayment' component={SettingsPayment} />
        <Stack.Screen name="AddNewCard" component={AddNewCard} />
        <Stack.Screen name="SettingsSecurity" component={SettingsSecurity} />
        <Stack.Screen name="ChangePIN" component={ChangePIN} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
        <Stack.Screen name="SettingsLanguage" component={SettingsLanguage} />
        <Stack.Screen name="SettingsPrivacyPolicy" component={SettingsPrivacyPolicy} />
        <Stack.Screen name="InviteFriends" component={InviteFriends} />
        <Stack.Screen name="HelpCenter" component={HelpCenter} />
        <Stack.Screen name="CustomerService" component={CustomerService} />
        <Stack.Screen name="EReceipt" component={EReceipt} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
        <Stack.Screen name="ReviewSummary" component={ReviewSummary} />
        <Stack.Screen name="EnterYourPIN" component={EnterYourPIN} />
        <Stack.Screen name="TopDoctors" component={TopDoctors} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="Favourite" component={Favourite} />
        <Stack.Screen name="DoctorDetails" component={DoctorDetails} />
        <Stack.Screen name="DoctorReviews" component={DoctorReviews} />
        <Stack.Screen name="BookAppointment" component={BookAppointment} />
        <Stack.Screen name="SelectPackage" component={SelectPackage} />
        <Stack.Screen name="PatientDetails" component={PatientDetails} />
        <Stack.Screen name="CancelAppointment" component={CancelAppointment} />
        <Stack.Screen name="CancelAppointmentPaymentMethods" component={CancelAppointmentPaymentMethods} />
        <Stack.Screen name="RescheduleAppointment" component={RescheduleAppointment} />
        <Stack.Screen name="SelectRescheduleAppointmentDate" component={SelectRescheduleAppointmentDate} />
        <Stack.Screen name="MyAppointmentMessaging" component={MyAppointmentMessaging} />
        <Stack.Screen name="MyAppointmentVoiceCall" component={MyAppointmentVoiceCall} />
        <Stack.Screen name="MyAppointmentVideoCall" component={MyAppointmentVideoCall} />
        <Stack.Screen name="VideoCall" component={VideoCall} />
        <Stack.Screen name="VoiceCall" component={VoiceCall} />
        <Stack.Screen name="SessionEnded" component={SessionEnded} />
        <Stack.Screen name="LeaveReview" component={LeaveReview} />
        <Stack.Screen name="VoiceCallHistoryDetails" component={VoiceCallHistoryDetails} />
        <Stack.Screen name="VideoCallHistoryDetails" component={VideoCallHistoryDetails} />
        <Stack.Screen name="VoiceCallHistoryDetailsPlayRecordings" component={VoiceCallHistoryDetailsPlayRecordings} />
        <Stack.Screen name="VideoCallHistoryDetailsPlayRecordings" component={VideoCallHistoryDetailsPlayRecordings} />
        <Stack.Screen name="MyBookmarkedArticles" component={MyBookmarkedArticles} />
        <Stack.Screen name="ArticlesDetails" component={ArticlesDetails} />
        <Stack.Screen name="ArticlesSeeAll" component={ArticlesSeeAll} />
        <Stack.Screen name="TrendingArticles" component={TrendingArticles} />
        <Stack.Screen name="Address" component={Address} />
        <Stack.Screen name="AddNewAddress" component={AddNewAddress} />
        <Stack.Screen name="Messaging" component={Messaging} />
        <Stack.Screen name="EditCard" component={EditCard} />
        <Stack.Screen name="PatientQ" component={PatientQ} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation