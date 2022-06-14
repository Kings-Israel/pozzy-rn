import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker, onOpen } from "react-native-actions-sheet-picker";

import axiosConfig from "../helpers/axiosConfig";
import { AuthContext } from "../context/AuthProvider";

export default function AddKid({navigation}) {
  const { user: parent } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fname, setFname] = useState(null);
  const [lname, setLname] = useState(null);
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [school, setSchool] = useState(null);
  const [grade, setGrade] = useState(null);
  const [schools, setSchools] = useState([]);
  const [grades, setGrades] = useState([]);
  const [schoolSelected, setSchoolSelected] = useState(undefined);
  const [query, setSchoolQuery] = useState("");
  const [gradeQuery, setGradeQuery] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    axiosConfig.get("/all_schools").then((response) => {
      setSchools(response.data.message);
    });
  }, []);

  /*
   **Example filter function
   * @param {string} filter
   */
  const filteredSchools = useMemo(() => {
    if (schools && schools.length > 0) {
      return schools.filter((item) =>
        item.name
          .toLocaleLowerCase("en")
          .includes(query.toLocaleLowerCase("en"))
      );
    }
  }, [schools, query]);

  /*
   **Example filter function
   * @param {string} filter
   */
  const filteredGrades = useMemo(() => {
    if (grades && grades.length > 0) {
      return grades.filter((item) =>
        item.name
          .toLocaleLowerCase("en")
          .includes(query.toLocaleLowerCase("en"))
      );
    }
  }, [grades, query]);

  /*
   **Input search
   *@param {string} text
   */
  const onSchoolSearch = (text) => {
    setSchoolQuery(text);
  };

  const onGradeSearch = (text) => {
    setGradeQuery(text);
  };

  function selectSchool(school) {
    setSchool(school);
    setGrades(school.grades);
  }

  function selectGrade(grade) {
    setGrade(grade);
  }

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  function addKid(fname, lname, age, gender, school, grade) {
    setIsLoading(true);
    axiosConfig.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${parent.token}`;
    axiosConfig
      .post("/parent/add/student", {
        fname,
        lname,
        age,
        gender,
        school: school != null ? school.id : null,
        grade: grade != null ? grade.id : null,
      })
      .then((response) => {
        fadeIn();
        setTimeout(() => {
          fadeOut();
        }, 4000);
        navigation.navigate('Home')
      })
      .catch((error) => {
        const key = Object.keys(error.response.data.errors[0])[0];
        setError(error.response.data.errors[0][key][0]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // console.log(school)
  }

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 5 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.logo}
            source={require("../assets/pozzy.png")}
          ></Image>
        </View>
        <SafeAreaView>
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.successView}>
              <Text style={{ color: "green", marginTop: 8 }}>
                Kid Added Successfully
              </Text>
            </View>
          </Animated.View>
        </SafeAreaView>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.inputArea}>
            <View
              style={{
                flex: 0.3,
                alignContent: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <TextInput
                style={[styles.inputBox]}
                value={fname}
                onChangeText={setFname}
                placeholder="Enter First Name"
                placeholderTextColor="white"
              ></TextInput>
            </View>
            <TextInput
              style={[styles.inputBox, styles.mt4]}
              value={lname}
              onChangeText={setLname}
              placeholder="Enter Last Name"
              placeholderTextColor="white"
            ></TextInput>
            <View
              style={{
                alignContent: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <TextInput
                style={[styles.inputBox, styles.mt4]}
                value={age}
                onChangeText={setAge}
                placeholder="Enter Age"
                placeholderTextColor="white"
                keyboardType="number-pad"
              ></TextInput>
            </View>
            <View
              style={{
                alignContent: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <TextInput
                style={[styles.inputBox, styles.mt4]}
                value={gender}
                onChangeText={setGender}
                placeholder="Enter Gender"
                placeholderTextColor="white"
              ></TextInput>
            </View>
            <View style={styles.schoolSelect}>
              <Text style={styles.schoolSelectText}>School:</Text>
              {school && (
                <Text style={styles.schoolSelectSelected}>{school.name}</Text>
              )}
            </View>
            <Button
              title="Select School"
              color="green"
              onPress={() => onOpen("school")}
            ></Button>
            <Picker
              id="school"
              data={filteredSchools}
              inputValue={query}
              searchable={true}
              label="Select School"
              setSelected={selectSchool}
              onSearch={onSchoolSearch}
            />
            <View style={styles.schoolSelect}>
              <Text style={styles.schoolSelectText}>Grade:</Text>
              {grade && (
                <Text style={styles.schoolSelectSelected}>{grade.name}</Text>
              )}
            </View>
            {school && (
              <Button
                title="Select Grade"
                color="green"
                onPress={() => onOpen("grade")}
              ></Button>
            )}
            <Picker
              id="grade"
              data={filteredGrades}
              inputValue={query}
              searchable={true}
              label="Select Grade"
              setSelected={selectGrade}
              onSearch={onGradeSearch}
            />
            {error && (
              <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>
            )}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => addKid(fname, lname, age, gender, school, grade)}
            >
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="black"
                  style={{ marginRight: 18 }}
                ></ActivityIndicator>
              )}
              <Text style={styles.loginButtonText}>Add Kid</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#1d9bf1",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "center",
  },
  inputArea: {
    marginTop: 20,
    backgroundColor: "#1d9bf1",
    paddingTop: 30,
    paddingHorizontal: 70,
    borderRadius: 10,
  },
  inputBox: {
    padding: 1,
    paddingHorizontal: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  loginButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 7,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 10,
  },
  loginButtonText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
  schoolSelect: {
    flexDirection: "row",
    marginVertical: 16,
  },
  schoolSelectText: {
    color: "white",
    marginRight: 5,
  },
  schoolSelectSelected: {},
  mt4: {
    marginTop: 16,
  },
});
