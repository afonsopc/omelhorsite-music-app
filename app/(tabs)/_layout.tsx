import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { useTabBar } from "../../src/providers/TabBarProvider";
import { useEffect } from "react";

export default function TabLayout() {
  const { setHasTabBar } = useTabBar();

  useEffect(() => {
    setHasTabBar(true);
    return () => {
      setHasTabBar(false);
    };
  }, [setHasTabBar]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <Label>Home</Label>
          <Icon sf="house.fill" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="search">
          <Label>Search</Label>
          <Icon sf="magnifyingglass.circle.fill" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="playlists">
          <Label>Playlists</Label>
          <Icon sf="music.note.list" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Label>Profile</Label>
          <Icon sf="person.crop.circle" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </View>
  );
}
