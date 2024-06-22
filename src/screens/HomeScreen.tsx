import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  FlatList,
} from "react-native";
import { COLORS, SPACING } from "../theme/Theme";
import {
  upcomingMovies,
  popularMovies,
  nowPlayingMovies,
  baseImagePath,
} from "../api/apicalls";
import InputHeader from "../components/InputHeader";
import CategoryHeader from "../components/CategoryHeader";
import SubMovieCard from "../components/SubMovieCard";
import MovieCard from "../components/MovieCard";

const { width, height } = Dimensions.get("window");

const getUpcomingMoviesList = async () => {
  try {
    let response = await fetch(upcomingMovies);
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(
      "Il y a un problème dans getUpcomingMoviesList Fonction",
      error
    );
  }
};

const getNowPlayingMoviesList = async () => {
  try {
    let response = await fetch(nowPlayingMovies);
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(
      "Il y a un problème dans getNowPlayingMoviesList Fonction",
      error
    );
  }
};

const getPopularMoviesList = async () => {
  try {
    let response = await fetch(popularMovies);
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(
      "Il y a un problème dans getPopularMoviesList Fonction",
      error
    );
  }
};

const HomeScreen = ({ navigation }: any) => {
  const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState<any>(undefined);
  const [upcomingMoviesList, setUpcomingMoviesList] = useState<any>(undefined);
  const [popularMoviesList, setPopularMoviesList] = useState<any>(undefined);

  useEffect(() => {
    (async () => {
      let tempNowPlaying = await getNowPlayingMoviesList();
      setNowPlayingMoviesList([{id:'dummy1'},...tempNowPlaying.results,{id:'dummy2'}]);

      let tempUpcoming = await getUpcomingMoviesList();
      setUpcomingMoviesList(tempUpcoming.results);

      let tempPopular = await getPopularMoviesList();
      setPopularMoviesList(tempPopular.results);
    })();
  }, []);

  const searchMoviesFunction = () => {
    navigation.navigate("Search");
  };

  if (
    nowPlayingMoviesList === undefined ||
    upcomingMoviesList === undefined ||
    popularMoviesList === undefined
  ) {
    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <StatusBar hidden />
        <View style={styles.InputHeaderContainer}>
          <InputHeader searchFunction={searchMoviesFunction} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={"large"} color={COLORS.Orange} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      contentContainerStyle={styles.scrollViewContainer}
    >
      <StatusBar hidden />
      <View style={styles.InputHeaderContainer}>
        <InputHeader searchFunction={searchMoviesFunction} />
      </View>
      <CategoryHeader title={"Now Playing"} />
      <FlatList
        data={nowPlayingMoviesList}
        keyExtractor={(item: any) => item.id}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.containerGap36}
        horizontal
        renderItem={({ item, index }) => {
          if(!item.original_title){
            return(
              <View style={{width: (width-(width*0.7 + SPACING.space_36*2)) / 2,
            }}></View>
            )
          }
          return(
          <MovieCard
            shouldMarginatedAtEnd={true}
            cardFunction={() => {
              navigation.push('MovieDetails', {movieid:item.id});
            }}
            cardWidth={width * 0.7}
            isFirst={index == 0 ? true : false}
            isLast={index == upcomingMoviesList?.length - 1 ? true : false}
            title={item.original_title}
            imagePath={baseImagePath("w780", item.poster_path)}
            genre={item.genre_ids.slice(1,4)}
            vote_average={item.vote_average}
            vote_count={item.vote_count}
          />);        
        }}
      />
      <CategoryHeader title={"Popular"} />
      <FlatList
        data={popularMoviesList}
        keyExtractor={(item: any) => item.id}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.containerGap36}
        horizontal
        renderItem={({ item, index }) => (
          <SubMovieCard
            shouldMarginatedAtEnd={true}
            cardFunction={() => {
              navigation.push('MovieDetails', {movieid:item.id});
            }}
            cardWidth={width / 3}
            isFirst={index == 0 ? true : false}
            isLast={index == upcomingMoviesList?.length - 1 ? true : false}
            title={item.original_title}
            imagePath={baseImagePath("w342", item.poster_path)}
          />
        )}
      />
      <CategoryHeader title={"Upcoming"} />
      <FlatList
        data={upcomingMoviesList}
        keyExtractor={(item: any) => item.id}
        bounces={false}
        showsVerticalScrollIndicator={false}
        snapToInterval={width*0.7 + SPACING.space_36}
        contentContainerStyle={styles.containerGap36}
        horizontal
        renderItem={({ item, index }) => (
          <SubMovieCard
            shouldMarginatedAtEnd={true}
            cardFunction={() => {
              navigation.push('MovieDetails', {movieid:item.id});
            }}
            cardWidth={width / 3}
            isFirst={index == 0 ? true : false}
            isLast={index == upcomingMoviesList?.length - 1 ? true : false}
            title={item.original_title}
            imagePath={baseImagePath("w342", item.poster_path)}
          />
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
  },
  InputHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
  },
  contentContainer: {
    // Ajoutez ici le style pour le conteneur de contenu après le chargement
  },
  text: {
    color: COLORS.White,
  },
  containerGap36: {
    gap: SPACING.space_36,
  },
});

export default HomeScreen;
