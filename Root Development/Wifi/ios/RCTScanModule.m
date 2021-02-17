//
//  RCTScanModule.m
//  Wifi_TrustUp
//
//  Created by Brandon Feldbaus on 2/15/21.
//

#import "RCTScanModule.h"
#import <React/RCTLog.h>
#import "LANProperties.h"

#import "MMLANScanner.h"

@interface RCTScanModule()<MMLANScannerDelegate>
@property(nonatomic,strong)MMLANScanner *lanScanner;
@property(nonatomic,assign,readwrite)BOOL isScanRunning;
@end


@implementation RCTScanModule{
  NSMutableArray *connectedDevicesMutable;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"scanComplete", @"scanDeviceFound", @"scanStarted", @"scanStopped", @"scanFailed"];
}

RCT_EXPORT_MODULE(CalendarModuleFoo);
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@",name, location);
  
  [self startNetworkScan];
  
}

-(void)startNetworkScan {
    
    self.isScanRunning=YES;
    
    connectedDevicesMutable = [[NSMutableArray alloc] init];
    
    [self.lanScanner start];
  
    [self sendEventWithName:@"scanStarted" body:@"The scan has started..."];
    
};

-(void)stopNetworkScan {
    
    [self.lanScanner stop];
    
    self.isScanRunning=NO;
  
    [self sendEventWithName:@"scanStopped" body:@"The scan has stopped..."];
  
}

//Getting the SSID string using LANProperties
-(NSString*)ssidName {

    return [NSString stringWithFormat:@"SSID: %@",[LANProperties fetchSSIDInfo]];
};

- (void)lanScanDidFailedToScan {
  self.isScanRunning=NO;
  [self sendEventWithName:@"scanFailed" body:@"The scan has failed..."];
  
}

- (void)lanScanDidFindNewDevice:(MMDevice *)device {
  //Check if the Device is already added
  if (![connectedDevicesMutable containsObject:device]) {

      [connectedDevicesMutable addObject:device];
  }
  
  NSSortDescriptor *valueDescriptor = [[NSSortDescriptor alloc] initWithKey:@"ipAddress" ascending:YES];
  
  //Updating the array that holds the data. MainVC will be notified by KVO
  self.connectedDevices = [connectedDevicesMutable sortedArrayUsingDescriptors:@[valueDescriptor]];
  
  [self sendEventWithName:@"scanDeviceFound" body:@"The scan has found a device..."];
  
}

- (void)lanScanDidFinishScanningWithStatus:(MMLanScannerStatus)status {
  self.isScanRunning=NO;
  
  //Checks the status of finished. Then call the appropriate method
  if (status == MMLanScannerStatusFinished) {
      
    [self sendEventWithName:@"scanComplete" body:self.connectedDevices];
    
  }
  else if (status==MMLanScannerStatusCancelled) {
     
    RCTLogInfo(@"Scan Cancelled");
    
  }
}

@end
