//
//  RCTScanModule.h
//  Wifi_TrustUp
//
//  Created by Brandon Feldbaus on 2/15/21.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "MMLANScanner.h"

NS_ASSUME_NONNULL_BEGIN


@interface RCTScanModule : RCTEventEmitter <RCTBridgeModule>
@property(nonatomic,strong)NSArray *connectedDevices;
@property(nonatomic,assign,readonly)BOOL isScanRunning;
@end

NS_ASSUME_NONNULL_END
