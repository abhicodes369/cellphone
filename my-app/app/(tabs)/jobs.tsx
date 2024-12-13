import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { supabase } from "../../utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/jobsStyles";

//  interface of the job
interface Job {
  id: string | number;
  customer_name: string;
  device_model: string;
  device_issue: string;
  device_condition: string;
  serial_number: string;
  status: string;
  created_at: string;
  customer_phone: string;
  customer_email: string;
  customers?: {
    name?: string;
    phoneno?: string;
    email?: string;
  };
}

interface FilterOptions {
  status: string;
  dateRange: "all" | "today" | "week" | "month";
  sortBy: "newest" | "oldest" | "status";
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: "all",
    dateRange: "all",
    sortBy: "newest",
  });

  //  job statuses
  const JOB_STATUSES = [
    "received", 
    "in-progress", 
    "completed", 
    "on-hold"
  ];

  // Fetching jobs from Supabase
  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, customers:customers(*)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform data to ensure all required fields are present
      const processedJobs = (data || []).map(job => ({
        ...job,
        customer_name: job.customers?.name || 'Unknown Customer',
        customer_phone: job.customers?.phoneno || 'N/A',
        customer_email: job.customers?.email || 'N/A',
      }));

      setJobs(processedJobs);
      setFilteredJobs(processedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Alert.alert("Error", "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // Updating job status
  const updateJobStatus = async (newStatus: string) => {
    if (!selectedJob) return;
  
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ status: newStatus })
        .eq('id', selectedJob.id);
  
      if (error) throw error;
  
      // Optimistically update local state
      const updatedJobs = jobs.map(job => 
        job.id === selectedJob.id 
          ? { ...job, status: newStatus } 
          : job
      );
  
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
  
      // Close modals and reset selections
      setShowStatusModal(false);
      setSelectedJob(null);
      setSelectedStatus("");
  
      Alert.alert("Success", "Job status updated successfully");
    } catch (error) {
      console.error("Error updating job status:", error);
      Alert.alert("Error", "Failed to update job status");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  // Existing filtering logic (as in previous version)
  useEffect(() => {
    let result = [...jobs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          String(job.id).toLowerCase().includes(query) ||
          (job.customer_name || '').toLowerCase().includes(query) ||
          (job.device_model || '').toLowerCase().includes(query) ||
          (job.serial_number || '').toLowerCase().includes(query)
      );
    }

    if (filterOptions.status !== "all") {
      result = result.filter((job) => job.status === filterOptions.status);
    }

    const now = new Date();
    switch (filterOptions.dateRange) {
      case "today":
        result = result.filter(
          (job) =>
            new Date(job.created_at).toDateString() === now.toDateString()
        );
        break;
      case "week":
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        result = result.filter((job) => new Date(job.created_at) >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        result = result.filter((job) => new Date(job.created_at) >= monthAgo);
        break;
    }

    switch (filterOptions.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "status":
        result.sort((a, b) => a.status.localeCompare(b.status));
        break;
    }

    setFilteredJobs(result);
  }, [jobs, searchQuery, filterOptions]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
        return "#FFD700";
      case "in-progress":
        return "#87CEEB";
      case "completed":
        return "#90EE90";
      case "on-hold":
        return "#FF6347";
      default:
        return "#808080";
    }
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity
        style={styles.jobCard}
        onPress={() => setSelectedJob(item)}
    >
        <SafeAreaView style={styles.jobHeader}>
            <Text style={styles.jobId}>Job #{item.id}</Text>
            <TouchableOpacity 
              onPress={() => {
                setSelectedJob(item);
                setShowStatusModal(true);
              }}
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
                <Text>{item.status}</Text>
            </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.jobInfo}>
            <Text style={styles.customerName}>{item.customer_name}</Text>
            <Text style={styles.deviceModel}>{item.device_model}</Text>
            <Text style={styles.date}>
                {new Date(item.created_at).toLocaleDateString()}
            </Text>
        </View>
    </TouchableOpacity>
  );

  // Update Modal status

  const StatusUpdateModal = () => (
    <Modal
      visible={showStatusModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowStatusModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Job Status</Text>
          
          {JOB_STATUSES.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusOption,
                selectedStatus === status && styles.selectedStatusOption
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={styles.statusOptionText}>{status}</Text>
            </TouchableOpacity>
          ))}
          
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modalConfirmButton,
                !selectedStatus && styles.modalButtonDisabled
              ]}
              onPress={() => updateJobStatus(selectedStatus)}
              disabled={!selectedStatus}
            >
              <Text style={styles.modalButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

const JobDetailsModal = () => (
    <Modal
      visible={!!selectedJob && !showStatusModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedJob(null)}
    >
      {selectedJob && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Job Details</Text>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Job ID</Text>
              <Text style={styles.detailText}>#{selectedJob.id}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Customer Information</Text>
              <Text style={styles.detailText}>
                Name: {selectedJob.customer_name}
              </Text>
              <Text style={styles.detailText}>
                Phone: {selectedJob.customer_phone}
              </Text>
              <Text style={styles.detailText}>
                Email: {selectedJob.customer_email}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Device Information</Text>
              <Text style={styles.detailText}>
                Model: {selectedJob.device_model}
              </Text>
              <Text style={styles.detailText}>
                Serial: {selectedJob.serial_number}
              </Text>
              <Text style={styles.detailText}>
                Condition: {selectedJob.device_condition}
              </Text>
              <Text style={styles.detailText}>
                Issue: {selectedJob.device_issue}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedJob(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No jobs found</Text>
          }
        />
      )}

      <StatusUpdateModal />
      <JobDetailsModal />
    </View>
  );
}