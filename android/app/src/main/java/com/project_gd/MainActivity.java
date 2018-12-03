package com.project_gd;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "project_GD";
    }

    private ReactInstanceManager mReactInstanceManager;

    @Override
    public void invokeDefaultOnBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

}
