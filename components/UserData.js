import { useState, useEffect } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from "../ctx";

const useUserData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { session, signOut } = useSession(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = JSON.parse(await AsyncStorage.getItem('userInfo'))
            try {
                const response = await axios({
                    url: `${process.env.EXPO_PUBLIC_API_URL}/user/userInfo`,
                    method: "POST",
                    headers: {
                        "Authorization": `bearer ${session}`,
                        "Refresher": `bearer ${data.refreshToken}`
                    }
                })
                setData(response.data[0]);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export default useUserData;