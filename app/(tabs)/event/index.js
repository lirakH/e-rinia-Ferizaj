import { View, Text, Button } from 'react-native'
import React from 'react'
import {Link, useRouter} from 'expo-router';

export default function Page() {
  const router = useRouter();
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{fontSize:18}}>Event Page</Text>
      <Button onPress={() => router.push('/event/1')} title='Go To event 1' />
      <Button onPress={() => router.push('/event/2')} title='Go To event 2' />
      <Button onPress={() => router.push('/event/3?author=john')} title='Go To event 3' />
      <Link href={{
        pathname: 'event/4',
        params: { author: 'Jenny' }
      }}>
        <Text style={{fontSize:18}}>Go to event 4</Text>
      </Link>
      <Button onPress={() => router.back()} title='Go Back' />
    </View>
  )
}