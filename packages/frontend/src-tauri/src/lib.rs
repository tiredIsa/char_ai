

use tauri::{AppHandle}; 
use tauri_plugin_safe_area_insets::SafeAreaInsetsExt; 
use tauri_plugin_safe_area_insets::Insets; 

#[tauri::command]
async fn get_safe_area_insets(app_handle: AppHandle) -> Result<Insets, String> {
    let insets = app_handle.safe_area_insets().get_insets();
    match insets {
        Ok(i) => Ok(i),
        Err(e) => Err(format!("Error getting insets: {:?}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_safe_area_insets::init())
    .invoke_handler(tauri::generate_handler![get_safe_area_insets]) // Регистрируем команду
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
