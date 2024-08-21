import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categories, doctors, ratings } from '../data';
import NotFoundCard from '../components/NotFoundCard';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '../components/Button';
import { FontAwesome } from "@expo/vector-icons";
import HorizontalDoctorCard from '../components/HorizontalDoctorCard';
import axios from 'axios';
import estados from '../data/estado.json'

const Search = ({ navigation }) => {
  const refRBSheet = useRef();
  const [selectedCategories, setSelectedCategories] = useState(["1"]);
  const [states, setStates] = useState([]);
  const [specialities , setSpecialities] = useState([])
  const [medics, setMedics] = useState([])
  const [keyword, setkeyword] = useState();
  

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

  const handleSearch = async () => {
    //Si todos los campos son vacios no permite continuar 
    if (keyword == null && specialities.length == 0 && states.length == 0){
      setMedics([])
      return
    }
  
    
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


  useEffect(() => {
    resSpecialties()
  }, [])


  /**
  * Render header
  */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              resizeMode='contain'
              style={[styles.backIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900
          }]}>
            Search
          </Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.moreIcon, {
              tintColor: COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
      </View>
    )
  }

  /**
   * Render content
  */
  const renderContent = () => {

    return (
      <View>
        {/* Search bar */}
        <View
          onPress={() => console.log("Search")}
          style={[styles.searchBarContainer, {
            backgroundColor: COLORS.secondaryWhite
          }]}>
          <TouchableOpacity
            onPress={handleSearch}>
            <Image
              source={icons.search2}
              resizeMode='contain'
              style={styles.searchIcon}
            />
          </TouchableOpacity>
          <TextInput
            placeholder='Search'
            placeholderTextColor={COLORS.gray}
            style={[styles.searchInput, {
              color: COLORS.greyscale900
            }]}
            value={keyword}
            onChangeText={(text) => setkeyword(text)}
          />
          <TouchableOpacity
            onPress={() => refRBSheet.current.open()}>
            <Image
              source={icons.filter}
              resizeMode='contain'
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Results container  */}
        <View>
          {/* Events result list */}
          <View style={{
            backgroundColor: COLORS.secondaryWhite,
            marginVertical: 16
          }}>
            {medics.length > 0 ? (
              <>
                {
                  <FlatList
                    data={medics}
                    keyExtractor={(item) => item.uuid}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                      return (
                        <HorizontalDoctorCard
                          name={item?.given_name + " " + item?.family_name}
                          image={item?.profile_picture}
                          main_st={item.main_st}
                          neighborhood={item.neighborhood}
                          consultationFee={item?.price}
                          office_state={item.office_state}
                          rating={item?.score}
                          //numReviews={item.numReviews}
                          isAvailable={true}
                          onPress={() => navigation.navigate("DoctorDetails")}
                        />
                      );
                    }}
                  />
                }
              </>
            ) : (
              <NotFoundCard />
            )}
          </View>
        </View>
      </View>
    )
  }

  // Toggle category selection
  const toggleCategory = (categoryId) => {
    const updatedCategories = [...selectedCategories];
    const index = updatedCategories.indexOf(categoryId);

    if (index === -1) {
      updatedCategories.push(categoryId);
    } else {
      updatedCategories.splice(index, 1);
    }

    setSelectedCategories(updatedCategories);
  };

  // toggle rating selection
  const toggleState = (state) => {
    const updatedStates = [...states];
    const index = updatedStates.indexOf(state);

    if (index === -1) {
      updatedStates.push(state);
    } else {
      updatedStates.splice(index, 1);
    }

    setStates(updatedStates);
  };

  // Category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedCategories.includes(item) ? COLORS.primary : "transparent",
        padding: 10,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
      }}
      onPress={() => toggleCategory(item)}>

      <Text style={{
        color: selectedCategories.includes(item) ? COLORS.white : COLORS.primary
      }}>{item}</Text>
    </TouchableOpacity>
  );

  const renderRatingItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: states.includes(item.name) ? COLORS.primary : "transparent",
        paddingHorizontal: 16,
        paddingVertical: 6,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => toggleState(item.name)}>
      <Text style={{
        color: states.includes(item.name) ? COLORS.white : COLORS.primary
      }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <View>
          {renderContent()}
        </View>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={384}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            draggableIcon: {
              backgroundColor: "#000",
            },
            container: {
              borderTopRightRadius: 32,
              borderTopLeftRadius: 32,
              height: 384,
              backgroundColor: COLORS.white,
              alignItems: "center",
            }
          }}
        >
          <Text style={[styles.bottomTitle, {
            color: COLORS.greyscale900
          }]}>Filtro</Text>
          <View style={styles.separateLine} />
          <View style={{ width: SIZES.width - 32 }}>
            <Text style={[styles.sheetTitle, {
              color: COLORS.greyscale900
            }]}>Especialidad</Text>
            <FlatList
              data={specialities}
              keyExtractor={item => item}
              showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={renderCategoryItem}
            />

            <Text style={[styles.sheetTitle, {
              color: COLORS.greyscale900
            }]}>Estados</Text>
            <FlatList
              data={estados}
              keyExtractor={item => item.name}
              showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={renderRatingItem}
            />
          </View>

          <View style={styles.separateLine} />

          <View style={styles.bottomContainer}>
            <Button
              title="Borrar"
              style={{
                width: (SIZES.width - 32) / 2 - 8,
                backgroundColor: COLORS.tansparentPrimary,
                borderRadius: 32,
                borderColor: COLORS.tansparentPrimary
              }}
              textColor={COLORS.primary}
              onPress={() => {setSelectedCategories([]), setStates([])}}
            />
            <Button
              title="Filtrar"
              filled
              style={styles.logoutButton}
              onPress={() => {handleSearch(),refRBSheet.current.close()}}
            />
          </View>
        </RBSheet>
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
    marginBottom: 16
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.black,
    marginLeft: 16
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  searchBarContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.secondaryWhite,
    padding: 16,
    borderRadius: 12,
    height: 52,
    marginBottom: 16,
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
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    justifyContent: "space-between"
  },
  tabBtn: {
    width: (SIZES.width - 32) / 2 - 6,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.4,
    borderColor: COLORS.primary,
    borderRadius: 32
  },
  selectedTab: {
    width: (SIZES.width - 32) / 2 - 6,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.4,
    borderColor: COLORS.primary,
    borderRadius: 32
  },
  tabBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.primary,
    textAlign: "center"
  },
  selectedTabText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.white,
    textAlign: "center"
  },
  resultContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
  },
  subResult: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: COLORS.primary
  },
  resultLeftView: {
    flexDirection: "row"
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
    width: SIZES.width
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: COLORS.black,
    textAlign: "center",
    marginTop: 12
  },
  separateLine: {
    height: .4,
    width: SIZES.width - 32,
    backgroundColor: COLORS.greyscale300,
    marginVertical: 12
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.black,
    marginVertical: 12
  },
  reusltTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    justifyContent: "space-between"
  },
  viewDashboard: {
    flexDirection: "row",
    alignItems: "center",
    width: 36,
    justifyContent: "space-between"
  },
  dashboardIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary
  },
  tabText: {
    fontSize: 20,
    fontFamily: "semiBold",
    color: COLORS.black
  }
})

export default Search