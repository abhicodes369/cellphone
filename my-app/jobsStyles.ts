import { StyleSheet } from "react-native";
const jobStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
    },
    header: {
      flexDirection: "row",
      padding: 16,
      backgroundColor: "#fff",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    searchContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f0f0f0",
      borderRadius: 8,
      marginRight: 10,
      paddingHorizontal: 10,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 40,
      fontSize: 16,
    },
    filterButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: "#f0f0f0",
    },
    listContainer: {
      padding: 16,
    },
    jobCard: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    jobHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    jobId: {
      fontSize: 16,
      fontWeight: "bold",
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      overflow: "hidden",
    },
    jobInfo: {
      gap: 4,
    },
    customerName: {
      fontSize: 15,
      color: "#444",
    },
    deviceModel: {
      fontSize: 14,
      color: "#666",
    },
    date: {
      fontSize: 12,
      color: "#888",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    detailSection: {
      padding: 10,
      backgroundColor: "#f9f9f9",
      borderRadius: 5,
      marginVertical: 10,
    },
    detailLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 5,
    },
    detailText: {
      fontSize: 14,
      color: "#666",
      lineHeight: 20,
    },
    closeButton: {
      backgroundColor: "#f0f0f0",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 16,
    },
    closeButtonText: {
      fontSize: 16,
      color: "#666",
      fontWeight: "600",
    },
    emptyText: {
      fontSize: 14,
      color: "#999",
      textAlign: "center",
      marginVertical: 20,
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    statusOption: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      alignItems: 'center',
    },
    selectedStatusOption: {
      backgroundColor: '#f0f0f0',
    },
    statusOptionText: {
      fontSize: 16,
      color: '#333',
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
    },
    modalCancelButton: {
      flex: 1,
      padding: 15,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      marginRight: 10,
      borderRadius: 8,
    },
    modalConfirmButton: {
      flex: 1,
      padding: 15,
      backgroundColor: '#007bff',
      alignItems: 'center',
      borderRadius: 8,
    },
    modalButtonDisabled: {
      backgroundColor: '#cccccc',
    },
    modalButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });


export default jobStyles ;