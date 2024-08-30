import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import { ScrollView } from 'react-native-virtualized-view';
import { doctorReviews } from '../data';
import ReviewCard from '../components/ReviewCard';
import Button from '../components/Button';
import Header from '../components/Header';

const DoctorDetails = ({route, navigation }) => {
    const {medicInfo} = route.params
    const medic = JSON.parse(medicInfo)

    //console.log(medicInfo)
    /**
     * Render header
     */
    const renderHeader = () => {
        const [isFavourite, setIsFavourite] = useState(false);

        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            resizeMode='contain'
                            style={[styles.backIcon, {
                                tintColor: COLORS.black
                            }]} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle,]}>Conoce a tu Médico</Text>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity
                        onPress={() => setIsFavourite(!isFavourite)}>
                        <Image
                            source={isFavourite ? icons.heart2 : icons.heart2Outline}
                            resizeMode='contain'
                            style={[styles.heartIcon, {
                                tintColor: isFavourite ? COLORS.primary : COLORS.greyscale900
                            }]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image
                            source={icons.moreCircle}
                            resizeMode='contain'
                            style={[styles.moreIcon, {
                                tintColor: COLORS.black
                            }]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    /**
     * render content
     */
    const renderContent = () => {
        const [expanded, setExpanded] = useState(false);

        //const description = `Dr. Jenny Watson is the top most Immunologists specialist in Christ Hospital at London. She achived several awards for her wonderful contribution in medical field. She is available for private consultation.`

        const toggleExpanded = () => {
            setExpanded(!expanded);
        };

        return (
            <View>
                <View style={{ backgroundColor: COLORS.greyscale500, marginBottom:10}}>
                    <View style={[styles.doctorCard, {
                        backgroundColor: COLORS.white,
                    }]}>
                        {/* <Text style={[styles.doctorName, {
                            color: COLORS.greyscale900
                        }]}>{medic.given_name} {medic.family_name}</Text> */}
                        <Image
                            source={{
                                uri:`${medic.profile_picture}`,
                                Cache:'none'
                              }}
                            resizeMode='cover'
                            style={styles.doctorImage}
                        />
                        <View style={{marginBottom:30}}>
                            <View style={[styles.separateLine, {
                                backgroundColor: COLORS.grayscale200,
                            }]} />
                            <Text style={styles.contentTitle}>Especialidades</Text>
                            <View style={{flexDirection:"row"}}>
                                {medic.specialities.specialities.map((item) =>(
                                    <Text key={item.name} style={[styles.doctorSpeciality, {
                                        color: COLORS.greyScale800
                                    }]}>{item.name} </Text>
                                ))}
                            </View>
                            <Text style={styles.contentTitle}>Ubicación</Text>
                            <Text style={[styles.doctorHospital, {
                                color: COLORS.greyScale800
                            }]}>Calle {medic.main_st}{"\n"+medic.street_intersections}{"\n"+medic.neighborhood}{"\n"+medic.office_state}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.featureContainer}>
                    {/* <View style={styles.featureItemContainer}>
                        <View style={styles.featureIconContainer}>
                            <Image
                                source={icons.friends}
                                resizeMode='contain'
                                style={styles.featureIcon}
                            />
                        </View>
                        <Text style={styles.featureItemNum}>5,000+</Text>
                        <Text style={[styles.featureItemName, {
                            color: COLORS.greyScale800
                        }]}>patients</Text>
                    </View> */}
                    <View style={styles.featureItemContainer}>
                        <View style={styles.featureIconContainer}>
                            <Image
                                source={icons.wallet}
                                resizeMode='contain'
                                style={styles.featureIcon}
                            />
                        </View>
                        <Text style={styles.featureItemNum}>{"Precio\nde\nconsulta"}</Text>
                        <Text style={[styles.featureItemName, {
                            color: COLORS.greyScale800
                        }]}>${medic.price}</Text>
                    </View>
                    <View style={styles.featureItemContainer}>
                        <View style={styles.featureIconContainer}>
                            <Image
                                source={icons.starHalf}
                                resizeMode='contain'
                                style={styles.featureIcon}
                            />
                        </View>
                        <Text style={styles.featureItemNum}>Calificación</Text>
                        <Text style={[styles.featureItemName, {
                            color: COLORS.greyScale800
                        }]}>{medic.score}</Text>
                    </View>
                    <View style={styles.featureItemContainer}>
                        <View style={styles.featureIconContainer}>
                            <Image
                                source={icons.videoCamera}
                                resizeMode='contain'
                                style={styles.featureIcon}
                            />
                        </View>
                        <Text style={styles.featureItemNum}>{"Citas\nvirtuales"}</Text>
                        <Text style={[styles.featureItemName, {
                            color: COLORS.greyScale800
                        }]}>{medic.is_videocall_allowed? "Si acepta": "No acepta"}</Text>
                    </View>
                </View>
                {/* <Text style={[styles.contentTitle, {
                    color: COLORS.greyscale900,
                }]}>Precio de consulta</Text>
                <Text style={[styles.description, {
                    color: COLORS.grayscale700,
                }]} numberOfLines={expanded ? undefined : 2}>{description}</Text>
                <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={styles.viewBtn}>
                        {expanded ? 'View Less' : 'View More'}
                    </Text>
                </TouchableOpacity>
                <Text style={[styles.contentTitle, {
                    color: COLORS.greyscale900,
                }]}>Working Time</Text>
                <Text style={[styles.description, {
                    color: COLORS.grayscale700,
                }]}>Monday - Friday, 08.00 AM - 20.00 PM</Text>
                <View style={styles.reviewTitleContainer}>
                    <Text style={[styles.contentTitle, {
                        color: COLORS.greyscale900
                    }]}>Reviews</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("DoctorReviews")}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={doctorReviews.slice(0, 2)}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => (
                        <ReviewCard
                            avatar={item.avatar}
                            name={item.name}
                            description={item.description}
                            avgRating={item.avgRating}
                            date={item.date}
                            numLikes={item.numLikes}
                        />
                    )}
                /> */}
            </View>
        )
    }
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {/* {renderHeader()} */}
                <Header title={medic.given_name+ " " + medic.family_name} />
                <ScrollView
                    style={[styles.scrollView, { backgroundColor: COLORS.greyscale500 }]}
                    showsVerticalScrollIndicator={false}>
                    {renderContent()}
                </ScrollView>
            </View>
            <View style={[styles.bottomContainer, {
                backgroundColor: COLORS.white,
            }]}>
                <Button
                    title="Agendar Cita"
                    filled
                    style={styles.btn}
                    onPress={() => navigation.navigate("BookAppointment", {hp_uuid: medic.uuid})}
                />
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
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 16
    },
    scrollView: {
        backgroundColor: COLORS.tertiaryWhite
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 16
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.darkBlue
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    heartIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
        marginRight: 16
    },
    viewRight: {
        flexDirection: "row",
        alignItems: "center"
    },
    doctorCard: {
        //height: 242,
        width: SIZES.width - 32,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        //flexDirection: "",
        alignItems: "center",
    },
    doctorImage: {
        marginTop:20,
        height: 100,
        width: 100,
        borderRadius: 16,
        marginHorizontal: 16
    },
    doctorName: {
        fontSize: 22,
        color: COLORS.greyscale900,
        fontFamily: "bold"
    },
    separateLine: {
        height: 1,
        width: SIZES.width - 32,
        backgroundColor: COLORS.grayscale200,
        marginVertical: 12
    },
    doctorSpeciality: {
        fontSize: 18,
        color: COLORS.greyScale800,
        fontFamily: "medium",
        marginBottom: 8
    },
    doctorHospital: {
        fontSize: 18,
        color: COLORS.greyScale800,
        fontFamily: "medium"
    },
    featureContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: 16,
        marginBottom:100
    },
    featureItemContainer: {
        alignItems: "center",
    },
    featureIconContainer: {
        height: 60,
        width: 60,
        backgroundColor: COLORS.tansparentPrimary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999
    },
    featureIcon: {
        height: 28,
        width: 28,
        tintColor: COLORS.primary
    },
    featureItemNum: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.primary,
        marginVertical: 6,
        textAlign:"center"
    },
    featureItemName: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.greyScale800
    },
    contentTitle: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.darkBlue,
        marginVertical: 16
    },
    description: {
        fontSize: 14,
        color: COLORS.grayscale700,
        fontFamily: "regular",
    },
    viewBtn: {
        color: COLORS.primary,
        marginTop: 5,
        fontSize: 14,
        fontFamily: "semiBold",
    },
    reviewTitleContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    seeAll: {
        color: COLORS.primary,
        fontSize: 16,
        fontFamily: "bold",
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 99,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center"
    },
    btn: {
        width: SIZES.width - 32
    }
})

export default DoctorDetails