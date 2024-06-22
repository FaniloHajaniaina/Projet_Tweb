import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/Theme';
import { LinearGradient } from "expo-linear-gradient";
import AppHeader from '../components/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';

const timeArray: string[] = [
  "10:30",
  "12:30",
  "14:30",
  "15:00",
  "19:30",
  "21:00",
];

const generateDate = () => {
  const date = new Date();
  let weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Stat'];
  let weekdays = [];
  for (let i=0; i < 7; i++) {
    let tempDate = {
      date:new Date(date.getTime() + i *24*60*60*1000).getDate(),
      day:weekday[new Date(date.getTime() + i *24*60*60*1000).getDay()],
    };
    weekdays.push(tempDate);
  }
  return weekdays;
};

const generateSeats = () => {
  let numRow = 8;
  let numColomn = 3;
  let rowArray = [];
  let start = 1;
  let reachnine = false;

  for(let i=0;i<numRow;i++){
    let colomnArray = [];
    for(let j=0;j<numColomn;j++){
      let seatObject = {
        number : start,
        taken: Boolean(Math.round(Math.random())),
        selected: false,
      };
      colomnArray.push(seatObject);
      start++;
    }
    if (i==3) {
      numColomn +=2;
    }
    if (numColomn<9 && !reachnine) {
      numColomn +=2;
    } else {
      reachnine = true; 
      numColomn -=2;
    }
    rowArray.push(colomnArray);
  }
  return rowArray;
};

const SeatBookingScreen = ({navigation,route}:any) => {
  const[dateArray, setDateArray] = useState<any[]>(generateDate());
  const[selectedDateIndex, setSelectedDateIndex] = useState<any>();
  const[price, setPrice] = useState<number>(0);
  const[twoDSeatArray, setTwoDSeatArrray] = useState<any[][]>(generateSeats());
  const[selectedSeatArray, setSelectedSeatArray] = useState([]);
  const[selectedTimeIndex, setSelectedTimeIndex] = useState<any>();

  const selecteSeat = (index:number,subindex:number,num:number) => {
    if (!twoDSeatArray[index][subindex].taken) {
      let array:any = [...selectedSeatArray];
      let temp = [...twoDSeatArray];
      temp[index][subindex].selected = !temp[index][subindex].selected; 
    }
  };

  return (
    <ScrollView style={styles.container}
    bounces={false}
    showsVerticalScrollIndicator={false}>
      <StatusBar hidden/>
      <View>
        <ImageBackground source={{uri: route.params?.BgImage }} style={styles.ImageBG}>
          <LinearGradient 
          colors={[COLORS.BlackRGB10, COLORS.Black]}
          style={styles.linearGradient}>
            <View style={styles.appHeaderContainer}>
            <AppHeader
            name="closecircleo"
            header={" "}
            action={() => navigation.goBack()}
          />
            </View>
          </LinearGradient>
        </ImageBackground>
        <Text style={styles.screenText}>Screen This Side</Text>
      </View>

      <View style={styles.seatContainer}>
        <View style={styles.containerGap20}>
          {
            twoDSeatArray?.map((item,index) => {
              return (
                <View key={index} style={styles.seatRow}>
                  {item?.map((subitem,subindex) => {
                    return(
                    <TouchableOpacity key={subitem.number} onPress={(() => {
                      selecteSeat(index,subindex,subitem.number)
                    })}>
                      <MaterialIcons name="chair" style={[styles.seatIcon,
                        subitem.taken ? {color:COLORS.Grey} : {},
                        subitem.selected ? {color:COLORS.Orange} : {},
                        ]} />
                    </TouchableOpacity>)
                  })}
                </View>
              )
            })
          }
        </View>
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display:'flex',
    flex:1,
    backgroundColor:COLORS.Black,
  },
  ImageBG:{
    width: '100%',
    aspectRatio:3072/1727,
  },
  linearGradient: {
    height: '100%',

  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  screenText: {
    textAlign:'center',
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color:COLORS.WhiteRGBA15,
  }, 
  seatContainer: {
    marginVertical: SPACING.space_20,
  },
  containerGap20: {
    gap: SPACING.space_20,
  },
  seatRow: {
    flexDirection: 'row',
    gap: SPACING.space_20,
    justifyContent: 'center',
  },
  seatIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
});

export default SeatBookingScreen;
