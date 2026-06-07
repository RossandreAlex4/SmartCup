import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { scale, verticalScale, scaleFont, moderateScale } from "../../themes/responsive";

type ConfirmLogoutModalProps = {
  visible: boolean;
  colors: {
    card: string;
    primary: string;
    text: string;
    secondaryText: string;
  };
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmLogoutModal({
  visible,
  colors,
  onCancel,
  onConfirm,
}: ConfirmLogoutModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.content,
            {
              backgroundColor: colors.card,
              borderColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Encerrar sessão
          </Text>

          <Text
            style={[
              styles.text,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            Ao voltar, sua sessão será encerrada.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonOutline,
                {
                  borderColor: colors.primary,
                },
              ]}
              onPress={onCancel}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: "#fff",
                  },
                ]}
              >
                Encerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(24),
  },

  content: {
    width: "100%",
    maxWidth: scale(360),
    borderWidth: 1,
    borderRadius: scale(12),
    padding: scale(20),
  },

  title: {
    fontSize: scaleFont(18),
    fontWeight: "700",
    marginBottom: verticalScale(8),
  },

  text: {
    fontSize: scaleFont(15),
    lineHeight: scaleFont(21),
    marginBottom: verticalScale(20),
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: scale(12),
  },

  button: {
    minWidth: scale(104),
    height: verticalScale(44),
    borderRadius: scale(10),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(16),
  },

  buttonOutline: {
    borderWidth: 1,
  },

  buttonText: {
    fontSize: scaleFont(14),
    fontWeight: "700",
  },
});
