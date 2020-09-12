import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
  Switch,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import stylesProfile from "../styles/profile-style";
import authStore from "../stores/authStore";
import spotStore from "../stores/spotStore";
import { deleteSpot } from "../actions/spotActions";
import { signOut } from "../actions/authActions";
import SpotListItem from "./SpotListItem";

const removeConfirm = (spotId) => {
  Alert.alert(
    "Are you sure you want to delete this spot?",
    "This will remove this spot permanently",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        onPress: () => deleteSpot({ spotId }),
        style: "destructive",
      },
    ]
  );
};

export default function Profile({ navigation }) {
  const [user, setUser] = useState(authStore.getUser());
  const [darkTheme, setDarkTheme] = useState(false);
  const toggleSwitch = () => setDarkTheme((previousState) => !previousState);
  const [createdSpots, setCreatedSpots] = useState(
    spotStore.getCreatedSpots(user.username)
  );

  async function logOutUser() {
    await AsyncStorage.clear();
    signOut();
  }

  function onChange() {
    setUser(authStore.getUser());
    setCreatedSpots(spotStore.getCreatedSpots(user.username));
  }

  useEffect(() => {
    spotStore.addChangeListener(onChange);

    return () => {
      spotStore.removeChangeListener(onChange);
    };
  }, []);

  return (
    <View style={stylesProfile.profileContainer}>
      <ImageBackground
        source={
          user.image ? user.image : require("../Images/defaultProfile.jpg")
        }
        style={stylesProfile.backgroundImage}
      >
        <View style={stylesProfile.headerContainer}>
          <View>
            <Switch
              // trackColor={{ false: "#767577", true: "#81b0ff" }}
              // thumbColor={darkTheme ? "#f5dd4b" : "#f4f3f4"}
              // ios_backgroundColor="#3e3e3e"
              trackColor={stylesProfile.darkSwitchEnable}
              thumbColor={stylesProfile.darkSwitchDisable}
              ios_backgroundColor={stylesProfile.darkSwitchBackground}
              onValueChange={toggleSwitch}
              value={darkTheme}
            />
            <Text>Dark Theme</Text>
          </View>
          <TouchableOpacity
            style={stylesProfile.logOutButtonContainer}
            onPress={() => logOutUser()}
          >
            <Text style={stylesProfile.logOutButton}>logOut</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={stylesProfile.favouriteContainer}>
          <View>
            <Text style={stylesProfile.userName}>
              {user.firstName ? user.firstName : "Guest user"}
            </Text>
            <Text style={stylesProfile.userName}>{user.lastName}</Text>
          </View>
          {createdSpots.length !== 0 ? (
            <Text style={stylesProfile.titleCreatedSpot}>Created Spots</Text>
          ) : (
            <Text style={stylesProfile.titleCreatedSpot}>
              You did not create any spot yet :(
            </Text>
          )}

          <FlatList
            style={stylesProfile.containerCreatedSpot}
            data={createdSpots}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Spot", { id: item._id })}
              >
                <TouchableOpacity
                  style={stylesProfile.deleteButton}
                  onPress={() => removeConfirm(item._id)}
                >
                  <Text style={stylesProfile.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                <SpotListItem spot={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
