import SwiftUI

struct CreateWalletView: View {
    @Environment(\.presentationMode) var presentationMode
    @State private var password: String = ""
    @State private var confirmPassword: String = ""
    @State private var isCreating = false
    
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: "212121"), Color(hex: "0B0F1D")],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            VStack(spacing: 24) {
                Text("Cüzdan Oluştur")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.top, 40)
                
                VStack(spacing: 16) {
                    SecureField("Şifre", text: $password)
                        .textFieldStyle(CustomTextFieldStyle())
                    
                    SecureField("Şifre Tekrar", text: $confirmPassword)
                        .textFieldStyle(CustomTextFieldStyle())
                }
                .padding(.horizontal)
                
                Button(action: {
                    createWallet()
                }) {
                    if isCreating {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    } else {
                        Text("Oluştur")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                    }
                }
                .frame(maxWidth: .infinity)
                .frame(height: 64)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "03A3EB"), Color(hex: "03DAC5")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(20)
                .padding(.horizontal)
                .disabled(isCreating || password.isEmpty || password != confirmPassword)
                
                Spacer()
            }
        }
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func createWallet() {
        isCreating = true
        // Wallet creation logic
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            isCreating = false
            presentationMode.wrappedValue.dismiss()
        }
    }
}

struct CustomTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding()
            .background(Color(hex: "1E1E1E"))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: "373E47"), lineWidth: 1)
            )
            .foregroundColor(.white)
    }
}

#Preview {
    NavigationView {
        CreateWalletView()
    }
}


