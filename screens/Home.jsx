import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { banners, categories, recommendedDoctors } from '../data';
import SubHeaderItem from '../components/SubHeaderItem';
import Category from '../components/Category';
import HorizontalDoctorCard from '../components/HorizontalDoctorCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from "../ctx";
import axios from 'axios';
import NotFoundCard from '../components/NotFoundCard';

const Home = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [specialties , setSpecialities] = useState([])
  const [MedicCategories, setCategories] = useState()
  const [info, setInfo] = useState()
  const [token, setToken] = useState();
  const {session} = useSession();
  const [user, setUser] = useState();
  const [medics, setMedics] = useState([])
  const [seeAll, setSeeAll] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState(["Cercanos"]);
  const [isLoading, setIsLoading] = useState(true)

  console.log(specialties)
 
  const mapSpecialtyToCategory = (specialty, index) => {
    switch (specialty) {
      case "Médico General":
        return {
          id: (index + 1).toString(),
          name: specialty,
          icon: icons.friends,
          iconColor: "rgba(36, 107, 253, 1)",
          backgroundColor: "rgba(36, 107, 253, .12)",
          onPress: "CategoryGeneralist"
        };
      case "Pediatra":
        return {
          id: (index + 1).toString(),
          name: specialty,
          icon: icons.children,
          iconColor: "rgba(36, 107, 253, 1)",
          backgroundColor: "rgba(36, 107, 253, .12)",
          onPress: "CategoryPediatric"
        };
      case "Psiquiatra":
        return {
          id: (index + 1).toString(),
          name: specialty,
          icon: icons.psiquiatria,
          iconColor: "rgba(36, 107, 253, 1)",
          backgroundColor: "rgba(36, 107, 253, .12)",
          onPress: "CategoryPediatric"
        };
      case "Neurocirujano":
        return {
          id: (index + 1).toString(),
          name: specialty,
          icon: icons.brain,
          iconColor: "rgba(36, 107, 253, 1)",
          backgroundColor: "rgba(36, 107, 253, .12)",
          onPress: "CategoryPediatric"
        };
      case "Urgencias":
        return {
          id: (index + 1).toString(),
          name: specialty,
          icon: icons.urgencias,
          iconColor: "rgba(36, 107, 253, 1)",
          backgroundColor: "rgba(36, 107, 253, .12)",
          onPress: "CategoryPediatric"
        };
      case "Dermatólogo":
          return {
            id: (index + 1).toString(),
            name: specialty,
            icon: icons.dermatologo,
            iconColor: "rgba(36, 107, 253, 1)",
            backgroundColor: "rgba(36, 107, 253, .12)",
            onPress: "CategoryPediatric"
          };
      case "Optometrista":
          return {
            id: (index + 1).toString(),
            name: specialty,
            icon: icons.eye,
            iconColor: "rgba(36, 107, 253, 1)",
            backgroundColor: "rgba(36, 107, 253, .12)",
            onPress: "CategoryPediatric"
          };
      case "Geriatra":
          return {
            id: (index + 1).toString(),
            name: specialty,
            icon: icons.geriatra,
            iconColor: "rgba(36, 107, 253, 1)",
            backgroundColor: "rgba(36, 107, 253, .12)",
            onPress: "CategoryPediatric"
          };
      case "Obstetra":
          return {
            id: (index + 1).toString(),
            name: specialty,
            icon: icons.obstetra,
            iconColor: "rgba(36, 107, 253, 1)",
            backgroundColor: "rgba(36, 107, 253, .12)",
            onPress: "CategoryPediatric"
          };
      // Agrega más casos según sea necesario
      default:
        return {
          id: (index + 1).toString(),
          name: specialty,
          icon: icons.more3,
          iconColor: "rgba(36, 107, 253, 1)",
          backgroundColor: "rgba(36, 107, 253, .12)",
          onPress: null
        };
    }
  };
  
  const getData = async () => {
    try {
      let value = await AsyncStorage.getItem('userInfo')
      setInfo(JSON.parse(value))
      let token = await AsyncStorage.getItem('tokens')
      token = token?.substring(1, token?.length-1)
      setToken(token)
    } catch (e) {
      console.log(e)
    }
  }
  
  const resSpecialties = async () => {
    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/discoverSpecialities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(data => setSpecialities(data))
  }

  const resUser = async() => {
    try{
      const responseInfo = await axios(`${process.env.EXPO_PUBLIC_API_URL}/user/userInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'bearer ' + session,
          "Refresher":'bearer ' + token,
        },
      })
      setUser(responseInfo.data[0])
      //console.log("response DATA: ",responseInfo.data[0])
  }catch(e){
    console.log("ERROR: ",e)
  }
}

const resMedics = async () => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/discoverMedics?uuid=${info?.uuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    setMedics(data);
    setIsLoading(false)
  } catch (error) {
    console.error("Error fetching medics:", error);
    setIsLoading(false)
  }
}


const handleSearch = async (data) => {
  console.log("data: ",data)
  //Si todos los campos son vacios no permite continuar 
  if (data.keyword == null && data.specialties.length == 0 && data.states.length == 0){
    setMedics([])
    return
  }

  let keyword = data.keyword
  let specialities = data.specialties
  let states = data.states
  const search = {
    specialities,
    states,
    keyword
  }

  const res = await axios(`${process.env.EXPO_PUBLIC_API_URL}/user/filterMedics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: search
  }).catch(error => console.log("ERROR: ",error))

  const result = res.data
  setMedics(result)
}

//Usar el Hook de useUserData para disminuir los ciclos de renderizado

  useEffect(() => {
    resSpecialties()
    getData()
  }, [])

  useEffect(() => {
    if(token && session){
      resUser()
    }
  }, [token, session])

  useEffect(() =>{
    if(info){
      resMedics()
    }
  }, [info])


  useEffect(() => {
    const initialCategories = [
      {
        id: "0",
        name: "Cercanos",
        icon: icons.location4,
        iconColor: "rgba(36, 107, 253, 1)",
        backgroundColor: "rgba(36, 107, 253, .12)",
        onPress: null
      },
      ...specialties.map((specialty, index) => mapSpecialtyToCategory(specialty, index))
    ];
    setCategories(initialCategories)
    //console.log("SPECIALTIES: ",specialties )
  }, [specialties])


  /**
  * Render header
  */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.viewLeft}>
          <Image
            source={images.premedLogo}
            resizeMode='contain'
            style={styles.userIcon}
          />
          <View style={styles.viewNameContainer}>
            <Text style={styles.greeeting}>Hola de nuevo 👋</Text>
            <Text style={[styles.title, {
              color: COLORS.greyscale900
            }]}>{user?.given_name} {user?.family_name}</Text>
          </View>
        </View>
        <View style={styles.viewRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}>
            <Image
              source={icons.notificationBell2}
              resizeMode='contain'
              style={[styles.bellIcon, { tintColor: COLORS.greyscale900 }]}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate("Favourite")}>
            <Image
              source={icons.heartOutline}
              resizeMode='contain'
              style={[styles.bookmarkIcon, { tintColor: COLORS.greyscale900 }]}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    )
  }
  /**
  * Render search bar
  */
  const renderSearchBar = () => {

    const handleInputFocus = () => {
      // Redirect to another screen
      navigation.navigate('Search');
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={[styles.searchBarContainer, {
          backgroundColor: COLORS.secondaryWhite
        }]}>
        <TouchableOpacity>
          <Image
            source={icons.search2}
            resizeMode='contain'
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <TextInput
          placeholder='Buscar Médicos'
          placeholderTextColor={COLORS.gray}
          style={styles.searchInput}
          onFocus={handleInputFocus}
        />
        <TouchableOpacity>
          <Image
            source={icons.filter}
            resizeMode='contain'
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  const renderBannerItem = ({ item }) => (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerTopContainer}>
        <View>
          <Text style={styles.bannerDicount}>{item.discount} OFF</Text>
          <Text style={styles.bannerDiscountName}>{item.discountName}</Text>
        </View>
        <Text style={styles.bannerDiscountNum}>{item.discount}</Text>
      </View>
      <View style={styles.bannerBottomContainer}>
        <Text style={styles.bannerBottomTitle}>{item.bottomTitle}</Text>
        <Text style={styles.bannerBottomSubtitle}>{item.bottomSubtitle}</Text>
      </View>
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  const handleEndReached = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const renderDot = (index) => {
    return (
      <View
        style={[styles.dot, index === currentIndex ? styles.activeDot : null]}
        key={index}
      />
    );
  };

  /**
  * Render banner
  */
  const renderBanner = () => {
    return (
      <View style={styles.bannerItemContainer}>
        <FlatList
          data={banners}
          renderItem={renderBannerItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / SIZES.width
            );
            setCurrentIndex(newIndex);
          }}
        />
        <View style={styles.dotContainer}>
          {banners.map((_, index) => renderDot(index))}
        </View>
      </View>
    )
  }

  /**
  * Render categories
  */
  const renderCategories = () => {

    const renderCategoryItem = ({ item }) => (
      <Category
        name={item.name}
        icon={item.icon}
        iconColor={selectedCategories.includes(item.name) ? COLORS.white : item.iconColor}
        backgroundColor={selectedCategories.includes(item.name) ? COLORS.primary : item.backgroundColor}
        onPress={() => toggleCategory(item.name)}
      />
    );

    const toggleCategory = async (category) => {
      const updatedCategories = [...selectedCategories];
      const index = updatedCategories.indexOf(category);
      let temp
      let states = []
      console.log("Category: ", category)
      if (updatedCategories.includes(category)) {
        if (index > -1) {
          updatedCategories.splice(index, 1);
        }
      } else {
        updatedCategories.push(category);
      }

      setSelectedCategories(updatedCategories);
      
      console.log("updatedCategories: ", updatedCategories)
      if (updatedCategories.includes("Cercanos")) {
        temp = updatedCategories.filter(item => item !== "Cercanos");
        states.push(user?.state)
      }else{
        temp = updatedCategories
        states.pop()
      }

      console.log("updatedCategories: ", temp)
      const data = {
        specialties: temp,
        states: states,
      }
      if(temp.length == 0){
        await resMedics()
      }else{
        await handleSearch(data)
      }
      if(temp.length == 0 && states.length == 0){
        setMedics([])
      }
    };



    return (
      <View>
        <SubHeaderItem
          title="Especialidades"
          navTitle="Ver mas"
          onPress={() => setSeeAll(!seeAll)}
        />
        <FlatList
          data={seeAll? MedicCategories: MedicCategories?.slice(0,6)}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          numColumns={3} // Render two items per row
          renderItem={renderCategoryItem}
        />
      </View>
    )
  }

  /**
   * render top doctor
   */
  const renderTopDoctors = () => {
    
    /* const [selectedCategories, setSelectedCategories] = useState(["Cercanos"]);
   
    //const filteredDoctors = recommendedDoctors.filter(doctor => selectedCategories.includes("0") || selectedCategories.includes(doctor.categoryId));


    // Category item
    const renderCategoryItem = ({ item }) => (
      <TouchableOpacity
        style={{
          backgroundColor: selectedCategories.includes(item.name) ? COLORS.primary : "transparent",
          padding: 10,
          marginVertical: 5,
          borderColor: COLORS.primary,
          borderWidth: 1.3,
          borderRadius: 8,
          marginRight: 12,
        }}
        onPress={() => toggleCategory(item.name)}>
        <Text style={{
          color: selectedCategories.includes(item.name) ? COLORS.white : COLORS.primary
        }}>{item.name}</Text>
      </TouchableOpacity>
    );

    // Toggle category selection
    const toggleCategory = async (category) => {
      const updatedCategories = [...selectedCategories];
      const index = updatedCategories.indexOf(category);
      let temp
      let states = []
      console.log("Category: ", category)
      if (updatedCategories.includes(category)) {
        if (index > -1) {
          updatedCategories.splice(index, 1);
        }
      } else {
        updatedCategories.push(category);
      }

      setSelectedCategories(updatedCategories);
      
      console.log("updatedCategories: ", updatedCategories)
      if (updatedCategories.includes("Cercanos")) {
        temp = updatedCategories.filter(item => item !== "Cercanos");
        states.push(user?.state)
      }else{
        temp = updatedCategories
        states.pop()
      }

      console.log("updatedCategories: ", temp)
      const data = {
        specialties: temp,
        states: states,
      }
      //console.log(data)
     await handleSearch(data)

    }; */

    if(isLoading){
      return (
        <View style={[styles.container, {
          backgroundColor: COLORS.tertiaryWhite,
          justifyContent:"center"
        }]}>
          <ActivityIndicator size={100} color={COLORS.primary}/>
        </View>
      )
    }
    return (
      <View>
        <SubHeaderItem
          title={selectedCategories.includes("Cercanos") &&  selectedCategories.length == 1?"Médicos cercanos más solicitados" : "Médicos filtrados"}
          /* navTitle="See all"
          onPress={() => navigation.navigate("TopDoctors")} */
        />
        {/* <FlatList
          data={MedicCategories}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={renderCategoryItem}
        /> */}
        <View style={{
          backgroundColor: COLORS.secondaryWhite,
          marginVertical: 16,
          marginBottom:100
        }}>
          
          {!medics.length == 0 && !isLoading? 
          (
            <FlatList
            data={medics}
            keyExtractor={item => item.uuid}
            renderItem={({ item }) => {
              return (
                <HorizontalDoctorCard
                  name={item?.given_name + " " + item?.family_name}
                  image={item?.profile_picture}
                  main_st={item.main_st}
                  neighborhood={item?.neighborhood}
                  office_state={item.office_state}
                  consultationFee={item?.price}
                  rating={item?.score}
                  //schedule_appointments={item.schedule_appointments}
                  isAvailable={true}
                  onPress={() => navigation.navigate("DoctorDetails", {medicInfo: JSON.stringify(item)})}
                />
              )
            }}
          />
          )
          :
          (
            <NotFoundCard 
              text={"Vuelva a usar los filtros para tener resultados"} 
              imageStyle={{with:140, height:200, marginVertical: 0}} 
              containerStyle={{marginVertical: 0}}
              titleStyle={{marginVertical: 0}}
            />
          )}
          
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white}]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderSearchBar()}
          {/* {renderBanner()} */}
          {renderCategories()}
          {renderTopDoctors()}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    alignItems: "center"
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 32
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  greeeting: {
    fontSize: 12,
    fontFamily: "regular",
    color: "gray",
    marginBottom: 4
  },
  title: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  viewNameContainer: {
    marginLeft: 12
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 8
  },
  bookmarkIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black
  },
  searchBarContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.secondaryWhite,
    padding: 16,
    borderRadius: 12,
    height: 52,
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center"
  },
  searchIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.gray
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "regular",
    marginHorizontal: 8
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary
  },
  bannerContainer: {
    width: SIZES.width - 32,
    height: 154,
    paddingHorizontal: 28,
    paddingTop: 28,
    borderRadius: 32,
    backgroundColor: COLORS.primary
  },
  bannerTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  bannerDicount: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.white,
    marginBottom: 4
  },
  bannerDiscountName: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.white
  },
  bannerDiscountNum: {
    fontSize: 46,
    fontFamily: "bold",
    color: COLORS.white
  },
  bannerBottomContainer: {
    marginTop: 8
  },
  bannerBottomTitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white
  },
  bannerBottomSubtitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white,
    marginTop: 4
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 999
  },
  firstName: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.dark2,
    marginTop: 6
  },
  bannerItemContainer: {
    width: "100%",
    paddingBottom: 10,
    backgroundColor: COLORS.primary,
    height: 170,
    borderRadius: 32,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.white,
  }

})

export default Home