import React, { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../context/AuthProvider";
import axiosConfig from "../helpers/axiosConfig";

export default function Home() {
  const [user, setUser] = useState(null);
  const [kids, setKids] = useState([]);
  const { user: parent } = useContext(AuthContext);
  useEffect(() => {
    setUser(parent);
    // console.log(parent)
    axiosConfig.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${parent.token}`;
    axiosConfig.get("parent/students").then((response) => {
      // console.log(response.data.message)
      setKids(response.data.message);
    });
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', marginRight: 8, marginTop: 4, }}>
        <Image
          style={styles.kidAvatar}
          source={{
            uri: `https://ui-avatars.com/api/?name=${item.fname} ${item.lname}&rounded=true&size=100`,
          }}
        />
        <View style={styles.detailsView}>
          <View style={styles.details}>
            <Text style={{ color: 'white' }}>{item.fname} {item.lname}</Text>
            <Text>{item.gender}</Text>
            {item.school ? <Text style={{ color: 'white' }}>School: {item.school.name}</Text> : <Text style={{ color: 'red' }}>School: No school assigned</Text>}
            {item.grade ? <Text>Grade: {item.grade.name}</Text> : <Text style={{ color: 'red' }}>Grade: No grade assigned</Text>}
          </View>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>
        {user.fname} {user.lname}
      </Text>
      <FlatList
        style={{ marginTop: 12 }}
        data={kids}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#20232A",
  },
  userName: {
    alignSelf: 'center',
    marginTop: 4,
    backgroundColor: "#000",
    color: "#fff",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  kidAvatar: {
    marginLeft: 8,
    width: 90,
    height: 90,
  },
  detailsView: {
    backgroundColor: '#545454',
    width: 330,
    marginLeft: -45,
    zIndex: -1,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  details: {
    marginLeft: 50,
    paddingTop: 2,
  }
});
