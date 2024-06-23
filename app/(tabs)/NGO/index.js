import { View, Text, Button } from 'react-native'
import React from 'react'
import {Link, useRouter} from 'expo-router';

export default function Page() {
  const router = useRouter();
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{fontSize:18}}>NGO Page</Text>
      <Button onPress={() => router.push('/NGO/1')} title='Go To NGO 1' />
      <Button onPress={() => router.push('/NGO/2')} title='Go To NGO 2' />
      <Button onPress={() => router.push('/NGO/3?author=john')} title='Go To NGO 3' />
      <Link href={{
        pathname: 'NGO/4',
        params: { author: 'Jenny' }
      }}>
        <Text style={{fontSize:18}}>Go to NGO 4</Text>
      </Link>
      <Button onPress={() => router.back()} title='Go Back' />
    </View>
  )
}