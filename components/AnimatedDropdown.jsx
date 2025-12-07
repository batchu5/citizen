import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import Search from "./Search";

const SearchIcon = () => <Text style={{ fontSize: 16, color: "#CDD7E1" }}><Search /></Text>;
const CloseIcon = () => (
  <Text style={{ fontSize: 12, color: "#737373" }}>✕</Text>
);


export default function AnimatedDropdown({ options, selected, onSelect }) {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  const optionAnim = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef(null);

  // Filter options based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOptions(options);
      setOpen(false);
    } else {
      const filtered = options.filter((opt) =>
        opt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
      setOpen(true);
    }
  }, [searchQuery, options]);

  // Cycling animation for placeholder when selected = "All"
  useEffect(() => {
    if (selected && selected !== "All") return;
    if (isSearchMode) return;

    const interval = setInterval(() => {
      optionAnim.setValue(0);
      Animated.timing(optionAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        optionAnim.setValue(20);
        Animated.timing(optionAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });

      setPlaceholderIndex((prev) => (prev + 1) % options.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [selected, options, isSearchMode]);

  const handleSelect = (opt) => {
    onSelect(opt);
    setOpen(false);
    setSearchQuery("");
    setIsSearchMode(false);
  };

  const handleBoxPress = () => {
    setIsSearchMode(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchMode(false);
    setOpen(false);
  };

  const handleBlur = () => {
    if (searchQuery.trim() === "") {
      setIsSearchMode(false);
      setOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* The main box - switches between display and search mode */}
      {!isSearchMode ? (
        <TouchableOpacity onPress={handleBoxPress} style={styles.box}>
          <Text style={styles.label}>
            Search for{" "}
            <Animated.Text
              style={{
                transform: [{ translateY: optionAnim }],
                color: "#737373",
                fontWeight: "400",
                fontSize: 14,
              }}
            >
              "
              {selected && selected !== "All"
                ? selected
                : options[placeholderIndex]}
              "
            </Animated.Text>
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.searchBox}>
          <SearchIcon />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Type to search..."
            placeholderTextColor="#A3A3A3"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            onBlur={handleBlur}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <CloseIcon />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Dropdown with filtered options */}
      {open && filteredOptions.length > 0 && (
        <View style={styles.dropdownContainer}>
          <ScrollView style={styles.optionsScroll} nestedScrollEnabled>
            {filteredOptions.map((opt, index) => {
              const isSelected = selected === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => handleSelect(opt)}
                  style={[
                    styles.dropdownOption,
                    isSelected && styles.dropdownOptionSelected,
                    index === filteredOptions.length - 1 && styles.dropdownOptionLast,
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      isSelected && styles.dropdownOptionTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                  {isSelected && <View style={styles.selectedIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* No results message */}
      {open && searchQuery.length > 0 && filteredOptions.length === 0 && (
        <View style={styles.dropdownContainer}>
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No results found</Text>
            <Text style={styles.noResultsSubtext}>
              Try a different search term
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: 295,
    zIndex: 1000,
  },
  box: {
    padding: 14,
    left: 10,
    borderWidth: 1,
    borderColor: "#CDD7E1",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    color: "#737373",
    fontSize: 14,
    fontWeight: "400",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    left: 10,
    borderWidth: 1,
    borderColor: "#CDD7E1",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#404040",
    marginLeft: 8,
    padding: 0,
    fontWeight:500
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    maxHeight: 250,
    zIndex: 9999,
  },
  optionsScroll: {
    maxHeight: 250,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  dropdownOptionSelected: {
    backgroundColor: "#F0F9FF",
    borderLeftWidth: 3,
    // borderLeftColor: "#3B82F6",
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    color: "#404040",
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: "#474848ff",
    fontWeight: "600",
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
  },
  noResults: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#737373",
    fontWeight: "600",
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 13,
    color: "#A3A3A3",
  },
});