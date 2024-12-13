import {
    Button,
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity,
  } from "react-native";
  import React, { useState } from "react";
  import { shareServiceDetails, handleSubmit } from '../../services';
  import styles from '../../homeStyles';
  import { Picker } from "@react-native-picker/picker";
  
  interface FormData {
      name: string;
      phoneno: string;
      email: string;
      deviceModel: string;
      deviceIssue: string;
      deviceCondition: string;
      serialNumber: string;
      deviceType: string;
      deviceFunctionality: {
          chargingPort: boolean;
          screenDisplay: boolean;
          isCharging: boolean;
          cameraWorking: boolean;
          audioWorking: boolean;
      };
  }
  
  export default function Home() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        phoneno: "",
        email: "",
        deviceModel: "",
        deviceIssue: "",
        deviceCondition: "",
        serialNumber: "",
        deviceType: "",
        deviceFunctionality: {
            chargingPort: false,
            screenDisplay: false,
            isCharging: false,
            cameraWorking: false,
            audioWorking: false,
        },
    });
    const [isLoading, setIsLoading] = useState(false);
  
    const DEVICE_TYPES = [
      "Mobile Phone", 
      "Laptop", 
      "Tablet", 
      "Desktop Computer", 
      "CPU", 
      "Camera", 
      "Printer", 
      "Gaming Console",
      "Other"
    ];
  
    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
  
    const toggleFunctionality = (field: keyof FormData['deviceFunctionality']) => {
        setFormData((prev) => ({
            ...prev,
            deviceFunctionality: {
                ...prev.deviceFunctionality,
                [field]: !prev.deviceFunctionality[field]
            }
        }));
    };
  
    return (
        <ScrollView style={styles.container}>
            {/* Customer Information */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Customer Information</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(value) => handleInputChange("name", value)}
                    placeholder="Full Name *"
                />
                <TextInput
                    style={styles.input}
                    value={formData.phoneno}
                    onChangeText={(value) => handleInputChange("phoneno", value)}
                    placeholder="Phone Number *"
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    placeholder="Email Address"
                    keyboardType="email-address"
                />
            </View>
  
            {/* Device Type Dropdown */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Device Type</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={formData.deviceType}
                        onValueChange={(itemValue) => 
                            setFormData((prev) => ({...prev, deviceType: itemValue}))
                        }
                    >
                        <Picker.Item label="Select Device Type" value="" />
                        {DEVICE_TYPES.map((type) => (
                            <Picker.Item key={type} label={type} value={type} />
                        ))}
                    </Picker>
                </View>
            </View>
  
            {/* Device Information */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Device Information</Text>
                <TextInput
                    style={styles.input}
                    value={formData.deviceModel}
                    onChangeText={(value) => handleInputChange("deviceModel", value)}
                    placeholder="Device Model"
                />
                <TextInput
                    style={styles.input}
                    value={formData.serialNumber}
                    onChangeText={(value) => handleInputChange("serialNumber", value)}
                    placeholder="Serial Number/IMEI"
                />
                <TextInput
                    style={styles.input}
                    value={formData.deviceCondition}
                    onChangeText={(value) => handleInputChange("deviceCondition", value)}
                    placeholder="Device Condition"
                    multiline
                />
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.deviceIssue}
                    onChangeText={(value) => handleInputChange("deviceIssue", value)}
                    placeholder="Describe the Issue"
                    multiline
                    numberOfLines={4}
                />
            </View>
  
            {/* Device Functionality Checks */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Device Functionality Checks</Text>
                {Object.entries(formData.deviceFunctionality).map(([key, value]) => (
                    <TouchableOpacity 
                        key={key} 
                        style={styles.checkboxContainer}
                        onPress={() => toggleFunctionality(key as keyof FormData['deviceFunctionality'])}
                    >
                        <View style={[
                            styles.checkbox, 
                            value ? styles.checkboxChecked : styles.checkboxUnchecked
                        ]} />
                        <Text style={styles.checkboxLabel}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
  
            <Button
                title={isLoading ? "Submitting..." : "Submit Service Request"}
                onPress={() => handleSubmit(formData, setIsLoading, shareServiceDetails, setFormData)}
                disabled={isLoading}
            />
        </ScrollView>
    );
  }