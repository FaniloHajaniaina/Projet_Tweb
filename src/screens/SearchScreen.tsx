import React, { useState } from "react";
import { Text, View, StyleSheet, Dimensions, FlatList } from "react-native";
import { COLORS, SPACING } from "../theme/Theme";
import { StatusBar } from "expo-status-bar";
import { baseImagePath, searchMovies } from "../api/apicalls";
import InputHeader from "../components/InputHeader";
import SubMovieCard from "../components/SubMovieCard";

const { width, height } = Dimensions.get("screen");

const SearchScreen = ({ navigation }: any) => {
  const [searchList, setSearchList] = useState([]);

  const searchMoviesFunction = async (name: string) => {
    try {
      const response = await fetch(searchMovies(name));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setSearchList(json.results);
    } catch (error) {
      console.error("Il y aaa un problème dans la fonction searchMoviesFunction", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        data={searchList}
        keyExtractor={(item: any) => item.id.toString()}
        bounces={false}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ListHeaderComponent={
          <View style={styles.InputHeaderContainer}>
            <InputHeader searchFunction={searchMoviesFunction} />
          </View>
        }
        contentContainerStyle={styles.centerContainer}
        renderItem={({ item, index }) => (
          <SubMovieCard
            shouldMarginatedAtEnd={false}
            shouldMarginatedAround={true}
            cardFunction={() => {
              navigation.push("MovieDetails", { movieid: item.id });
            }}
            cardWidth={width / 2 - SPACING.space_12 * 2}
            title={item.original_title}
            imagePath={baseImagePath("w342", item.poster_path)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    alignItems: "center",
    backgroundColor: COLORS.Black,
  },
  InputHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
    marginBottom: SPACING.space_28 - SPACING.space_12,
  },
  centerContainer: {
    alignItems: "center",
  },
});

export default SearchScreen;
