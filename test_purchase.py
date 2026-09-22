"""
Script de Teste / Simulação de Compra PerfectPay + Firebase
Uso: python test_purchase.py [email] [nome]

Exemplo:
python test_purchase.py novocliente@gmail.com "Carlos Silva"
"""

import sys
import uuid
import datetime

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

import firebase_admin
from firebase_admin import credentials, auth, firestore

CRED_PATH = r"C:\Users\kauem\Downloads\metodo-canal-dark-firebase-adminsdk-fbsvc-b2409e7afe.json"
DEFAULT_PASSWORD = "CANALDARK123"

def init_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate(CRED_PATH)
        firebase_admin.initialize_app(cred)
    return firestore.client()

def create_buyer_account(email, name="Cliente"):
    db = init_firebase()
    email = email.lower().strip()
    sale_id = f"PP-{int(datetime.datetime.now().timestamp())}"

    print(f"\n=======================================================")
    print(f"🚀 PROCESSANDO COMPRA AUTOMÁTICA")
    print(f"📧 E-mail do comprador: {email}")
    print(f"👤 Nome do comprador:   {name}")
    print(f"🔑 Senha gerada:        {DEFAULT_PASSWORD}")
    print(f"🧾 ID da Venda:         {sale_id}")
    print(f"=======================================================\n")

    user_id = None

    # 1. Criação ou busca no Firebase Authentication
    try:
        user = auth.create_user(
            email=email,
            password=DEFAULT_PASSWORD,
            display_name=name,
            email_verified=True
        )
        user_id = user.uid
        print(f"✅ [Auth] Conta criada com sucesso no Firebase Authentication! UID: {user_id}")
    except Exception as e:
        if "EMAIL_EXISTS" in str(e) or "already exists" in str(e):
            existing = auth.get_user_by_email(email)
            user_id = existing.uid
            print(f"ℹ️ [Auth] Usuário já existia no Authentication. UID recuperado: {user_id}")
        else:
            print(f"❌ [Auth] Erro ao criar usuário: {e}")

    # 2. Salva perfil do usuário no Cloud Firestore (/users/{userId})
    if user_id:
        user_data = {
            "email": email,
            "name": name,
            "role": "student",
            "status": "active",
            "hasActiveAccess": True,
            "tier": "premium",
            "products": ["metodo-canal-dark", "pack-1000-videos"],
            "createdAt": firestore.SERVER_TIMESTAMP,
            "updatedAt": firestore.SERVER_TIMESTAMP,
            "source": "perfectpay_automatic"
        }
        db.collection("users").document(user_id).set(user_data, merge=True)
        print(f"✅ [Firestore] Documento salvo na coleção /users/{user_id}!")

    # 3. Registra a compra na coleção /purchases/{saleId}
    purchase_data = {
        "saleId": sale_id,
        "userId": user_id,
        "customerEmail": email,
        "customerName": name,
        "product": "Método Canal Dark — Dark Channel Academy",
        "saleStatus": 2, # Aprovada
        "status": "approved",
        "paymentMethod": "PIX / Cartão",
        "approvedAt": firestore.SERVER_TIMESTAMP
    }
    db.collection("purchases").document(sale_id).set(purchase_data, merge=True)
    print(f"✅ [Firestore] Registro de venda salvo na coleção /purchases/{sale_id}!")

    print(f"\n🎉 SUCESSO ABSOLUTO! O comprador agora pode fazer login com:")
    print(f"👉 E-mail: {email}")
    print(f"👉 Senha:  {DEFAULT_PASSWORD}\n")

if __name__ == "__main__":
    test_email = sys.argv[1] if len(sys.argv) > 1 else "alunoperfectpay@gmail.com"
    test_name = sys.argv[2] if len(sys.argv) > 2 else "Aluno PerfectPay"
    create_buyer_account(test_email, test_name)
