<script setup>

</script>

<template>
        <v-container>
            <!-- Espacio para la segunda sección -->
            <fieldset>
                <legend>Visualizacion de incidencias</legend>
                <v-btn
                color="purple"
                type="submit"
                class="mt-3"
                >Mostrar Incidencias</v-btn>

                <v-row>
                <v-col>
                    
                </v-col>
                </v-row>
            </fieldset>
        </v-container>
</template>

<style scoped>
legend{
    padding: 0 10px; 
    font-weight: bold; 
    color: white;
    background-color:purple ;
    border-radius: 20px
  }
  fieldset{
    margin: 10px; 
    border-radius: 20px; 
    padding: 20px; 
    border: 1px solid purple;
  }
</style>