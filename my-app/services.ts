import { Alert } from "react-native";
import { supabase } from "./utils/supabase";
import * as Print from "expo-print";
import * as MailComposer from "expo-mail-composer";
import * as Sharing from "expo-sharing";
import { Linking } from "react-native";
import generatePDFHTML from "@/components/genPdf";

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

export const shareServiceDetails = async (formData: FormData, jobId: string, customerId: string) => {
    try {
        // code to generate pdf from html
        const html = generatePDFHTML(formData, jobId, customerId);
        const { uri } = await Print.printToFileAsync({
            html,
            base64: false,
        });

        // to share via email
        const shareViaEmail = async () => {
            const isAvailable = await MailComposer.isAvailableAsync();

            if (isAvailable) {
                await MailComposer.composeAsync({
                    subject: `Mobile Service Request - Job #${jobId}`,
                    body: `Please find attached your service request details.`,
                    recipients: formData.email ? [formData.email] : [],
                    attachments: [uri],
                });
            } else {
                Alert.alert("Error", "Email is not available on this device");
            }
        };

        // to share via whatsapp
        const shareViaWhatsApp = async () => {
            try {
                const phoneNumber = formData.phoneno.replace(/\D/g, "");
                const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;

                const canOpen = await Linking.canOpenURL(whatsappUrl);

                if (canOpen) {
                    await Sharing.shareAsync(uri, {
                        mimeType: "application/pdf",
                        dialogTitle: "Share service request details via WhatsApp",
                    });
                } else {
                    Alert.alert("Error", "WhatsApp is not installed on this device");
                }
            } catch (error) {
                console.error("WhatsApp sharing error:", error);
                Alert.alert("Error", "Failed to share via WhatsApp");
            }
        };

        // option to share details
        Alert.alert(
            "Share Service Details",
            "How would you like to share the service details?",
            [
                {
                    text: "Email",
                    onPress: shareViaEmail,
                },
                {
                    text: "WhatsApp",
                    onPress: shareViaWhatsApp,
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    } catch (error) {
        console.error("PDF generation error:", error);
        Alert.alert("Error", "Failed to generate service details");
    }
};



export const handleSubmit = async (
    formData: FormData, 
    setIsLoading: (loading: boolean) => void, 
    shareServiceDetails: (formData: FormData, jobId: string, customerId: string) => void,
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
) => {
    // validate the user to ensure that both name and phone no are required
    if (!formData.name || !formData.phoneno) {
        Alert.alert("Error", "Name and Phone Number are required");
        return;
    }

    if (!formData.phoneno.match(/^\d{10}$/)) {
        Alert.alert("Error", "Please enter a valid 10-digit phone number");
        return;
    }

    if (formData.email && !formData.email.includes("@")) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
    }

    setIsLoading(true);
    try {
        const { data: existingCustomer, error: searchError } = await supabase
            .from("customers")
            .select("id")
            .eq("phoneno", formData.phoneno)
            .single();

        if (searchError && searchError.code !== "PGRST116") {
            throw searchError;
        }

        let customerId;

        if (!existingCustomer) {
            // Insert new customer if doesn't exist
            const { data: newCustomer, error: customerError } = await supabase
                .from("customers")
                .insert([
                    {
                        name: formData.name,
                        phoneno: formData.phoneno,
                        email: formData.email || null,
                        created_at: new Date().toISOString(),
                    },
                ])
                .select()
                .single();

            if (customerError) throw customerError;
            customerId = newCustomer.id;
        } else {
            customerId = existingCustomer.id;
        }

        // Insert into jobs 
        const { data: jobData, error: jobsError } = await supabase
        .from("jobs")
        .insert([
          {
            customer_id: customerId,
            device_model: formData.deviceModel,
            device_issue: formData.deviceIssue,
            device_condition: formData.deviceCondition,
            serial_number: formData.serialNumber,
            status: "received",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

        if (jobsError) throw jobsError;
        Alert.alert(
            "Success",
            `Service request submitted successfully!\nService ID: ${jobData.id}\nCustomer ID: ${customerId}`,
            [
                {
                    text: "Share Details",
                    onPress: () => shareServiceDetails(formData, jobData.id, customerId),
                },
                {
                    text: "OK",
                    style: "cancel",
                },
            ]
        );

        // Clear form after successful submission
        setFormData({
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
    
    } catch (error: any) {
        console.error("Error details:", error);
        Alert.alert("Error", "Failed to submit form: " + error.message);
    } finally {
        setIsLoading(false);
    }
}