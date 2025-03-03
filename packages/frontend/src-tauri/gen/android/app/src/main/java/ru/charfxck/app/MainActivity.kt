package ru.charfxck.app

import android.os.Bundle
import android.view.View
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding
import ru.charfxck.app.TauriActivity

class MainActivity : TauriActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Включить отображение под системными барами
        // WindowCompat.setDecorFitsSystemWindows(window, false)
        
        
    }
}