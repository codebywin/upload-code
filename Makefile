TARGET := iphone:clang:15.6:15
ARCHS = arm64 arm64e
THEOS_PACKAGE_SCHEME = rootless
INSTALL_TARGET_PROCESSES = SpringBoard

THEOS_DEVICE_IP=192.168.2.115


include $(THEOS)/makefiles/common.mk

TWEAK_NAME = TTtest

TTtest_FILES = Tweak.x
TTtest_CFLAGS = -fobjc-arc -Wno-deprecated-declarations

include $(THEOS_MAKE_PATH)/tweak.mk
