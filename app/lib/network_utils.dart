import 'package:connectivity_plus/connectivity_plus.dart';

class NetworkUtils{
  static Future<bool> isConnectedToWifi() async{
    List<ConnectivityResult> connectivityResults = await Connectivity().checkConnectivity();
    return connectivityResults.contains(ConnectivityResult.wifi);
  }
}