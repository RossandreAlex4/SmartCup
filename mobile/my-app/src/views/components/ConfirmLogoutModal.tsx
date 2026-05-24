import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    padding: 24,
  },

  content: {
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  text: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 20,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },

  button: {
    minWidth: 104,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  buttonOutline: {
    borderWidth: 1,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
