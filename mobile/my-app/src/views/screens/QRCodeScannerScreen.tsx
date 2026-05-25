import { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

export default function QRCodeScannerScreen() {
  const { loginGarcom } = useContext(AuthContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleBarcodeScanned({ data }: { data: string }) {
    if (scanned || loading) return;
    setScanned(true);

    try {
      const parsed = JSON.parse(data);
      if (!parsed.token) {
        Alert.alert("QR Code invalido", "Este codigo nao e de acesso SmartCup.", [
          { text: "Tentar novamente", onPress: () => setScanned(false) },
        ]);
        return;
      }

      setLoading(true);
      await loginGarcom(parsed.token);
      router.replace("/(tabs)/mesas-screen");
    } catch (error: any) {
      setLoading(false);
      Alert.alert(
        "Acesso negado",
        error.message || "Token invalido ou expirado.",
        [{ text: "Tentar novamente", onPress: () => setScanned(false) }]
      );
    }
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0fce52" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Precisamos de acesso a camera para escanear o QR Code.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Permitir Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <Text style={styles.instructionText}>
            {loading ? "Verificando acesso..." : "Aponte a camera para o QR Code de acesso"}
          </Text>
          {loading && <ActivityIndicator size="small" color="#0fce52" style={{ marginTop: 12 }} />}
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const FRAME_SIZE = 260;
const CORNER_SIZE = 30;
const CORNER_THICKNESS = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
  },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  middleRow: {
    flexDirection: "row",
    height: FRAME_SIZE,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: "#0fce52",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 6,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 6,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 6,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 6,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  instructionText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  cancelButton: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  cancelText: {
    color: "#aaa",
    fontSize: 14,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 30,
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#0fce52",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  backText: {
    color: "#777",
    fontSize: 14,
  },
});
