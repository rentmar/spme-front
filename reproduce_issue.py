import requests
import json
import datetime

# Configuration - CHANGE THIS TO YOUR BACKEND URL
BASE_URL = "http://localhost:8000" 
ENDPOINT = "/api/monitoreo/crear-solicitud-fondos/"

def get_current_date():
    return datetime.date.today().strftime("%Y-%m-%d")

def test_create_solicitud():
    url = f"{BASE_URL}{ENDPOINT}"
    
    # Sample data based on SolicitudDeFondos.vue
    payload = {
        "detalle_destino_fondos": json.dumps({
            "items": [
                {
                    "partida": "1000",
                    "concepto": "Test Gasto 1",
                    "monto": 100.50
                },
                {
                    "partida": "2000",
                    "concepto": "Test Gasto 2",
                    "monto": 200.00
                }
            ]
        }),
        "forma_pago": 1, # Assuming 1 is a valid ID for payment method
        "lugar_solicitud": "La Paz",
        "fecha_solicitud": get_current_date(),
        "fecha_realizacion_actividad": get_current_date(),
        "monto_solicitado": 300.50,
        "validacion_responsable": False,
        "id_responsable": 1, # Assuming 1 is a valid user ID
        "validacion_coordinador": False,
        "id_coordinador": 2, # Assuming 2 is a valid user ID
        "id_usuario": 1, # Assuming 1 is the current user ID
        "id_actividad": 1, # Assuming 1 is a valid activity ID
        "descripcion_actividad": "Actividad de prueba",
        "objetivo_actividad": "Verificar endpoint",
        "id_tarea": None,
        "datos_forma_pago": json.dumps({
            "otros": {"nombre_otros": "", "ci_otros": ""},
            "transferencia": {
                "nombre_transferencia": "", 
                "ci_transferencia": "", 
                "entidad_bancaria": "", 
                "tipo_cuenta": "", 
                "numero_cuenta": ""
            }
        })
    }

    print(f"Sending request to {url}...")
    print("Payload:", json.dumps(payload, indent=2))

    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("Success!")
            print("Response:", response.json())
        else:
            print("Failed!")
            print("Response:", response.text)
            
    except requests.exceptions.ConnectionError:
        print(f"Error: Could not connect to {BASE_URL}. Is the backend running?")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_create_solicitud()
