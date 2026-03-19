import Foundation
import React

@objc(AppInfo)
class AppInfo: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc
  func getVersion(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let version =
      Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String
      ?? "0.0.0"
    resolve(version)
  }

  @objc
  func getBuildNumber(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let buildNumber =
      Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String
      ?? "0"
    resolve(buildNumber)
  }
}
